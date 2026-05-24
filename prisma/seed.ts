import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_MAKES,
  MOCK_MODELS,
  MOCK_YEARS,
  MOCK_ENGINES,
} from "../src/lib/mock-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding categories...");
  for (const c of MOCK_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, iconKey: c.iconKey, displayOrder: c.displayOrder },
      create: {
        name: c.name,
        slug: c.slug,
        iconKey: c.iconKey,
        displayOrder: c.displayOrder,
      },
    });
  }

  console.log("Seeding products...");
  for (const p of MOCK_PRODUCTS) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: p.categorySlug },
    });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
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
        categoryId: category.id,
      },
      create: {
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
        categoryId: category.id,
      },
    });
    // Reset images: delete existing, re-insert from mock
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (const [i, img] of p.images.entries()) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          altText: img.altText,
          displayOrder: i,
        },
      });
    }
  }

  console.log("Seeding vehicle fitment...");
  for (const m of MOCK_MAKES) {
    await prisma.vehicleMake.upsert({
      where: { slug: m.slug },
      update: { name: m.name },
      create: { name: m.name, slug: m.slug },
    });
  }
  for (const md of MOCK_MODELS) {
    const make = await prisma.vehicleMake.findUniqueOrThrow({
      where: { slug: MOCK_MAKES.find((mk) => mk.id === md.makeId)!.slug },
    });
    await prisma.vehicleModel.upsert({
      where: { makeId_slug: { makeId: make.id, slug: md.slug } },
      update: { name: md.name },
      create: { makeId: make.id, name: md.name, slug: md.slug },
    });
  }
  for (const y of MOCK_YEARS) {
    const mock = MOCK_MODELS.find((m) => m.id === y.modelId)!;
    const make = await prisma.vehicleMake.findUniqueOrThrow({
      where: { slug: MOCK_MAKES.find((mk) => mk.id === mock.makeId)!.slug },
    });
    const model = await prisma.vehicleModel.findUniqueOrThrow({
      where: { makeId_slug: { makeId: make.id, slug: mock.slug } },
    });
    await prisma.vehicleYear.upsert({
      where: { modelId_year: { modelId: model.id, year: y.year } },
      update: {},
      create: { modelId: model.id, year: y.year },
    });
  }
  // Engines in mock are not tied to a year — attach each engine to every year so the dropdown works.
  const allYears = await prisma.vehicleYear.findMany();
  for (const e of MOCK_ENGINES) {
    for (const y of allYears) {
      await prisma.vehicleEngine.upsert({
        where: { yearId_name: { yearId: y.id, name: e.name } },
        update: {},
        create: { yearId: y.id, name: e.name },
      });
    }
  }

  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    makes: await prisma.vehicleMake.count(),
    models: await prisma.vehicleModel.count(),
    years: await prisma.vehicleYear.count(),
    engines: await prisma.vehicleEngine.count(),
  };
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
