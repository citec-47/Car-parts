/**
 * Delete everything the demo-catalog seed created. Targets seed-generated
 * SKU patterns so products you added manually through the admin survive.
 *
 *   Engine SKUs:  BRAND-CODE-YYYYYYYY  (e.g. HONDA-B16A-19891994)
 *   Parts SKUs:   PREFIX-BASE-BRD       (e.g. EP-TURBO-T34-GAR)
 *
 * Empty seed-created categories are also removed; jdm-engines is preserved
 * because it was created by the user before the demo seed ran.
 *
 * Run:  npm run clear:demo
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEED_ENGINE_RE =
  /^(HONDA|TOYOTA|NISSAN|MAZDA|SUBARU|MITSUBISHI)-.+-\d{8}$/;
const SEED_PARTS_RE =
  /^(TRANS|EP|BS|BP|LT|WT|EI|EL|TG)-.+-[A-Z]{2,4}$/;

const SEED_CATEGORY_SLUGS = [
  "transmissions-drivetrain",
  "engine-parts",
  "brakes-suspension",
  "body-parts",
  "lighting",
  "wheels-tires",
  "exhaust-intake",
  "electronics",
  "tools-garage",
];

async function main() {
  console.log("Clearing demo catalog…");
  console.log("");

  // Find seed products by SKU pattern
  const all = await prisma.product.findMany({ select: { id: true, sku: true } });
  const seedIds = all
    .filter((p) => SEED_ENGINE_RE.test(p.sku) || SEED_PARTS_RE.test(p.sku))
    .map((p) => p.id);

  const surviving = all.length - seedIds.length;
  console.log(
    `Found ${all.length} products total; ${seedIds.length} match seed pattern, ${surviving} will be preserved.`,
  );

  if (seedIds.length > 0) {
    // Cascade delete the products (ProductImages have onDelete: Cascade).
    const result = await prisma.product.deleteMany({
      where: { id: { in: seedIds } },
    });
    console.log(`✔ Deleted ${result.count} products (by SKU pattern)`);
  }

  // Second pass: anything still left in a seed-created category came from the
  // seed too (variant SKU formats, brand names with trailing chars, etc.) —
  // wipe those by category membership.
  const sweep = await prisma.product.deleteMany({
    where: { category: { slug: { in: SEED_CATEGORY_SLUGS } } },
  });
  if (sweep.count > 0) {
    console.log(`✔ Deleted ${sweep.count} additional products (by category sweep)`);
  }

  // Delete the seed-created categories — only if they're now empty,
  // so we don't nuke a category the user repurposed.
  let removedCats = 0;
  for (const slug of SEED_CATEGORY_SLUGS) {
    const cat = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } },
    });
    if (!cat) continue;
    if (cat._count.products > 0) {
      console.log(
        `  skipping "${slug}" — still has ${cat._count.products} non-seed product(s)`,
      );
      continue;
    }
    await prisma.category.delete({ where: { id: cat.id } });
    removedCats++;
  }
  console.log(`✔ Removed ${removedCats} empty seed-created categories`);

  // Restore JDM Engines display order (seed may have shifted it)
  await prisma.category
    .update({
      where: { slug: "jdm-engines" },
      data: { displayOrder: 0 },
    })
    .catch(() => {
      // jdm-engines may not exist if the user already deleted it
    });

  const finalCounts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
  };
  console.log("");
  console.log(`Final state:`, finalCounts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
