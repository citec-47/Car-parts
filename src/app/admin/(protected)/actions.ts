"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function dollarsToCents(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function bumpHome() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

type UploadedImage = { url: string; publicId: string };

async function uploadImage(file: File): Promise<UploadedImage> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "revparts/products", resource_type: "image" },
      (err, res) => {
        if (err || !res) reject(err ?? new Error("Upload failed"));
        else resolve(res as { secure_url: string; public_id: string });
      },
    );
    stream.end(buffer);
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const price = String(formData.get("price") ?? "0");
  const salePrice = String(formData.get("salePrice") ?? "");
  const stock = Number(formData.get("stock") ?? 0);
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isHotDeal = formData.get("isHotDeal") === "on";

  if (!name || !sku || !categoryId) {
    throw new Error("name, sku, and category are required");
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await Promise.all(files.map(uploadImage));

  const product = await prisma.product.create({
    data: {
      name,
      slug: slugify(name) + "-" + Date.now().toString(36),
      sku,
      description,
      brand,
      priceCents: dollarsToCents(price),
      salePriceCents: salePrice ? dollarsToCents(salePrice) : null,
      stock: Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0,
      isActive,
      isFeatured,
      isHotDeal,
      categoryId,
      images: {
        create: uploaded.map((img, i) => ({
          url: img.url,
          cloudinaryPublicId: img.publicId,
          displayOrder: i,
        })),
      },
    },
  });

  bumpHome();
  redirect(`/admin/products/${product.id}/edit?ok=created`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const price = String(formData.get("price") ?? "0");
  const salePrice = String(formData.get("salePrice") ?? "");
  const stock = Number(formData.get("stock") ?? 0);
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isHotDeal = formData.get("isHotDeal") === "on";

  if (!name || !sku || !categoryId) {
    throw new Error("name, sku, and category are required");
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      sku,
      description,
      brand,
      priceCents: dollarsToCents(price),
      salePriceCents: salePrice ? dollarsToCents(salePrice) : null,
      stock: Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0,
      isActive,
      isFeatured,
      isHotDeal,
      categoryId,
    },
  });

  // New images (if any) are appended.
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length) {
    const uploaded = await Promise.all(files.map(uploadImage));
    const existingCount = await prisma.productImage.count({ where: { productId } });
    await prisma.productImage.createMany({
      data: uploaded.map((img, i) => ({
        productId,
        url: img.url,
        cloudinaryPublicId: img.publicId,
        displayOrder: existingCount + i,
      })),
    });
  }

  bumpHome();
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect(`/admin/products/${productId}/edit?ok=saved`);
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const images = await prisma.productImage.findMany({
    where: { productId: id },
    select: { cloudinaryPublicId: true },
  });
  await prisma.product.delete({ where: { id } });
  await Promise.allSettled(
    images
      .filter((i) => i.cloudinaryPublicId)
      .map((i) => cloudinary.uploader.destroy(i.cloudinaryPublicId!, { invalidate: true })),
  );
  bumpHome();
  redirect("/admin/products");
}

export async function deleteProductImage(formData: FormData) {
  const imageId = String(formData.get("imageId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (!imageId) return;
  const img = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!img) return;
  await prisma.productImage.delete({ where: { id: imageId } });
  if (img.cloudinaryPublicId) {
    await cloudinary.uploader
      .destroy(img.cloudinaryPublicId, { invalidate: true })
      .catch(() => {});
  }
  bumpHome();
  if (productId) revalidatePath(`/admin/products/${productId}/edit`);
}

export async function togglePublishFlag(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  if (!id || !["isActive", "isFeatured", "isHotDeal"].includes(field)) return;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { isActive: true, isFeatured: true, isHotDeal: true },
  });
  if (!product) return;
  await prisma.product.update({
    where: { id },
    data: { [field]: !product[field as keyof typeof product] },
  });
  bumpHome();
}

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "PENDING"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  const valid = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!id || !valid.includes(status)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
