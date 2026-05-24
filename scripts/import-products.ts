/**
 * WooCommerce CSV → RevParts (Prisma + Cloudinary) importer.
 *
 *   npm run import:dry-run   # parse + summarize, no writes
 *   npm run import:products  # actually import
 */

import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { v2 as cloudinary } from "cloudinary";

const DRY_RUN = process.argv.includes("--dry-run");
const CSV_PATH = resolve("import/products.csv");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type Row = Record<string, string>;

// ---------- helpers ----------

function pick(row: Row, ...keys: string[]): string {
  for (const k of keys) {
    for (const actual of Object.keys(row)) {
      if (actual.toLowerCase().trim() === k.toLowerCase()) {
        const v = row[actual];
        if (v != null && v !== "") return String(v).trim();
      }
    }
  }
  return "";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function dollarsToCents(v: string): number {
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function parseCategoryLeaf(raw: string): { name: string; slug: string } | null {
  if (!raw) return null;
  const first = raw.split(",")[0]?.trim();
  if (!first) return null;
  const leaf = first.split(">").pop()?.trim() ?? "";
  if (!leaf) return null;
  return { name: leaf, slug: slugify(leaf) };
}

function parseImages(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}

async function uploadImageFromUrl(
  url: string,
): Promise<{ secureUrl: string; publicId: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolveUpload, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "revparts/products/imported", resource_type: "image" },
          (err, r) => {
            if (err || !r) reject(err ?? new Error("upload failed"));
            else resolveUpload(r as { secure_url: string; public_id: string });
          },
        )
        .end(buf);
    },
  );
  return { secureUrl: result.secure_url, publicId: result.public_id };
}

// ---------- main ----------

type Counts = {
  total: number;
  imported: number;
  updated: number;
  skipped: number;
  errors: number;
  imagesUploaded: number;
};

async function main() {
  console.log(`Mode: ${DRY_RUN ? "DRY-RUN (no writes)" : "LIVE IMPORT"}`);
  console.log(`Reading ${CSV_PATH}`);

  let csv: string;
  try {
    csv = readFileSync(CSV_PATH, "utf8");
  } catch (e) {
    console.error(`Could not read ${CSV_PATH}: ${(e as Error).message}`);
    process.exit(1);
  }

  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Row[];

  console.log(`Found ${rows.length} rows`);
  if (rows[0]) {
    console.log(`Detected columns: ${Object.keys(rows[0]).join(", ")}`);
  }

  // pre-build a category cache so we don't query per-row
  const categoryBySlug = new Map<string, { id: string; name: string }>();
  if (!DRY_RUN) {
    const existing = await prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    });
    for (const c of existing) categoryBySlug.set(c.slug, { id: c.id, name: c.name });
  }

  async function ensureCategory(name: string, slug: string): Promise<string> {
    const cached = categoryBySlug.get(slug);
    if (cached) return cached.id;
    if (DRY_RUN) {
      categoryBySlug.set(slug, { id: `dryrun_${slug}`, name });
      return `dryrun_${slug}`;
    }
    const created = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug, displayOrder: 999 },
    });
    categoryBySlug.set(slug, { id: created.id, name: created.name });
    return created.id;
  }

  const counts: Counts = {
    total: rows.length,
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    imagesUploaded: 0,
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const num = `[${String(i + 1).padStart(4, " ")}/${rows.length}]`;
    try {
      const type = pick(row, "Type") || "simple";
      if (type.toLowerCase() === "variation") {
        counts.skipped++;
        console.log(`${num} SKIP variation`);
        continue;
      }

      const sku = pick(row, "SKU");
      const name = pick(row, "Name", "Product Name", "post_title");
      const description = pick(row, "Description", "Short description", "post_content");
      const brand = pick(row, "Brands", "Brand") || null;
      const priceRaw = pick(row, "Regular price", "Price");
      const salePriceRaw = pick(row, "Sale price");
      const stockRaw = pick(row, "Stock", "Stock quantity");
      const inStock = pick(row, "In stock?");
      const published = pick(row, "Published");
      const visibility = pick(row, "Visibility in catalog");
      const featured = pick(row, "Is featured?");
      const categoriesRaw = pick(row, "Categories", "tax:product_cat");
      const imagesRaw = pick(row, "Images");

      if (!sku || !name) {
        counts.skipped++;
        console.log(`${num} SKIP missing sku or name`);
        continue;
      }

      const category = parseCategoryLeaf(categoriesRaw) ?? {
        name: "Uncategorized",
        slug: "uncategorized",
      };
      const categoryId = await ensureCategory(category.name, category.slug);

      const isActive =
        published !== "0" &&
        visibility.toLowerCase() !== "hidden" &&
        type.toLowerCase() !== "draft";
      const isFeatured = featured === "1" || featured.toLowerCase() === "yes";
      const stock = stockRaw
        ? Math.max(0, Math.floor(Number(stockRaw)))
        : inStock === "0"
          ? 0
          : 0;

      const productData = {
        name,
        slug: slugify(name) + "-" + slugify(sku),
        sku,
        description: description || name,
        brand,
        priceCents: dollarsToCents(priceRaw || "0"),
        salePriceCents: salePriceRaw ? dollarsToCents(salePriceRaw) : null,
        stock,
        isActive,
        isFeatured,
        isHotDeal: false,
        categoryId,
      };

      const imageUrls = parseImages(imagesRaw);

      if (DRY_RUN) {
        console.log(
          `${num} OK   sku=${sku} name="${name.slice(0, 50)}" cat=${category.slug} price=${productData.priceCents / 100} imgs=${imageUrls.length}`,
        );
        counts.imported++;
        continue;
      }

      const existing = await prisma.product.findUnique({ where: { sku } });
      let productId: string;
      if (existing) {
        await prisma.product.update({ where: { id: existing.id }, data: productData });
        productId = existing.id;
        counts.updated++;
      } else {
        const created = await prisma.product.create({ data: productData });
        productId = created.id;
        counts.imported++;
      }

      // upload images that don't already exist for this product
      if (imageUrls.length) {
        const existingCount = await prisma.productImage.count({
          where: { productId },
        });
        if (existingCount === 0) {
          for (let j = 0; j < imageUrls.length; j++) {
            try {
              const uploaded = await uploadImageFromUrl(imageUrls[j]);
              await prisma.productImage.create({
                data: {
                  productId,
                  url: uploaded.secureUrl,
                  cloudinaryPublicId: uploaded.publicId,
                  displayOrder: j,
                },
              });
              counts.imagesUploaded++;
            } catch (e) {
              console.warn(`${num}   image ${imageUrls[j]} failed: ${(e as Error).message}`);
            }
          }
        }
      }

      console.log(
        `${num} ${existing ? "UPD " : "NEW "} sku=${sku} name="${name.slice(0, 50)}" imgs=${imageUrls.length}`,
      );
    } catch (e) {
      counts.errors++;
      console.error(`${num} ERR  ${(e as Error).message}`);
    }
  }

  console.log("");
  console.log("Done:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
