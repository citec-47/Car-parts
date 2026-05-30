// Data access layer — Prisma queries projected into the domain shapes from @/lib/types.

import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import type {
  Category,
  Product,
  ProductSpec,
  VehicleEngineRow,
  VehicleMake,
  VehicleModel,
  VehicleYearRow,
} from "./types";

function parseSpecs(value: unknown): ProductSpec[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((s): s is { label: unknown; value: unknown } =>
      typeof s === "object" && s !== null && "label" in s && "value" in s,
    )
    .map((s) => ({
      label: String(s.label ?? ""),
      value: String(s.value ?? ""),
    }))
    .filter((s) => s.label && s.value);
}

const productInclude = {
  category: { select: { slug: true } },
  images: { orderBy: { displayOrder: "asc" as const } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toProduct(p: ProductWithRelations): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    brand: p.brand,
    priceCents: p.priceCents,
    salePriceCents: p.salePriceCents,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    isFeatured: p.isFeatured,
    isHotDeal: p.isHotDeal,
    hotDealEndsAt: p.hotDealEndsAt,
    priceOnRequest: p.priceOnRequest,
    specs: parseSpecs(p.specs),
    categorySlug: p.category.slug,
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
    })),
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { displayOrder: "asc" } });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    iconKey: c.iconKey,
    displayOrder: c.displayOrder,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const c = await prisma.category.findUnique({ where: { slug } });
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    iconKey: c.iconKey,
    displayOrder: c.displayOrder,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug }, include: productInclude });
  return row ? toProduct(row) : null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, category: { slug } },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Exclude hot deals — they get their own slot on the home page.
  const rows = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true, isHotDeal: false },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getHotDealProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, isHotDeal: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return getAllProducts();
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ],
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getVehicleMakes(): Promise<VehicleMake[]> {
  const rows = await prisma.vehicleMake.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
  return rows.map((m) => ({ id: m.id, name: m.name, slug: m.slug }));
}

export async function getAllVehicleModels(): Promise<VehicleModel[]> {
  const rows = await prisma.vehicleModel.findMany({ orderBy: { name: "asc" } });
  return rows.map((m) => ({ id: m.id, makeId: m.makeId, name: m.name, slug: m.slug }));
}

export async function getVehicleModels(makeId: string): Promise<VehicleModel[]> {
  const rows = await prisma.vehicleModel.findMany({
    where: { makeId },
    orderBy: { name: "asc" },
  });
  return rows.map((m) => ({ id: m.id, makeId: m.makeId, name: m.name, slug: m.slug }));
}

export async function getAllVehicleYears(): Promise<VehicleYearRow[]> {
  const rows = await prisma.vehicleYear.findMany({ orderBy: { year: "desc" } });
  return rows.map((y) => ({ id: y.id, modelId: y.modelId, year: y.year }));
}

export async function getVehicleYears(modelId: string): Promise<number[]> {
  const rows = await prisma.vehicleYear.findMany({
    where: { modelId },
    orderBy: { year: "desc" },
    select: { year: true },
  });
  return rows.map((y) => y.year);
}

export async function getVehicleEngines(): Promise<VehicleEngineRow[]> {
  // Distinct engine names across all years; the cascading filter in the UI is by year.
  const rows = await prisma.vehicleEngine.findMany({
    distinct: ["name"],
    orderBy: { name: "asc" },
  });
  return rows.map((e) => ({ id: e.id, yearId: e.yearId, name: e.name }));
}
