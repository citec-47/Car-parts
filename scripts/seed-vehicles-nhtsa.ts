/**
 * Seed the Vehicle Finder with real make/model data from NHTSA vPIC.
 *
 *   API:  https://vpic.nhtsa.dot.gov/api/  (free, no key, no rate limit)
 *
 * Drops existing VehicleMake/Model/Year/Engine rows and repopulates from
 * a curated list of ~30 popular consumer auto brands. For each make we
 * fetch all models from NHTSA, cap at top 25 alphabetical, attach a year
 * range 2000-2025, and add a small flat list of generic engine options.
 *
 * Run:  npm run seed:vehicles
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const POPULAR_MAKES = new Set(
  [
    // Japanese
    "HONDA", "ACURA", "TOYOTA", "LEXUS", "NISSAN", "INFINITI",
    "MAZDA", "SUBARU", "MITSUBISHI",
    // American
    "FORD", "CHEVROLET", "GMC", "DODGE", "RAM", "JEEP",
    "CHRYSLER", "BUICK", "CADILLAC", "LINCOLN", "TESLA",
    // German
    "BMW", "MERCEDES-BENZ", "AUDI", "VOLKSWAGEN", "PORSCHE", "MINI",
    // Korean
    "HYUNDAI", "KIA", "GENESIS",
    // European misc
    "VOLVO", "JAGUAR", "LAND ROVER",
  ].map((m) => m.toUpperCase()),
);

const YEAR_START = 2000;
const YEAR_END = 2025;
const MAX_MODELS_PER_MAKE = 25;

const GENERIC_ENGINES = [
  "1.4L L4",
  "1.6L L4",
  "1.8L L4",
  "2.0L L4",
  "2.4L L4",
  "2.5L L4",
  "3.0L V6",
  "3.5L V6",
  "4.0L V6",
  "5.0L V8",
  "Electric",
  "Hybrid",
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => {
      if (w === w.toUpperCase() && w.length <= 3) return w; // BMW, GMC, AUDI etc
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

async function fetchJson<T = unknown>(url: string): Promise<T> {
  const r = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "RevParts/1.0" },
  });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return (await r.json()) as T;
}

type NhtsaResponse<T> = {
  Count: number;
  Message: string;
  SearchCriteria: string | null;
  Results: T[];
};

type MakeRow = { Make_ID: number; Make_Name: string };
type ModelRow = { Make_ID: number; Make_Name: string; Model_ID: number; Model_Name: string };

async function main() {
  console.log("Clearing existing vehicle data…");
  await prisma.vehicleEngine.deleteMany();
  await prisma.vehicleYear.deleteMany();
  await prisma.vehicleModel.deleteMany();
  await prisma.vehicleMake.deleteMany();

  console.log("Fetching all makes from NHTSA…");
  const allMakes = await fetchJson<NhtsaResponse<MakeRow>>(
    "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json",
  );
  const consumerMakes = allMakes.Results.filter((m) =>
    POPULAR_MAKES.has(m.Make_Name.toUpperCase().trim()),
  );
  console.log(
    `Got ${allMakes.Results.length} makes total; ${consumerMakes.length} match curated list.`,
  );
  console.log("");

  let totalModels = 0;
  let totalYears = 0;
  let displayOrder = 0;

  for (const make of consumerMakes) {
    const niceName = titleCase(make.Make_Name);
    const makeRow = await prisma.vehicleMake.create({
      data: {
        name: niceName,
        slug: slugify(niceName),
        displayOrder: displayOrder++,
      },
    });

    // Fetch models for this make
    let modelList: string[] = [];
    try {
      const resp = await fetchJson<NhtsaResponse<ModelRow>>(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(
          make.Make_Name,
        )}?format=json`,
      );
      // De-dupe + sort + cap
      const uniq = new Set<string>();
      for (const m of resp.Results) uniq.add(m.Model_Name);
      modelList = Array.from(uniq).sort().slice(0, MAX_MODELS_PER_MAKE);
    } catch (e) {
      console.warn(`  ! failed to fetch models for ${make.Make_Name}: ${(e as Error).message}`);
      continue;
    }

    if (modelList.length === 0) {
      console.log(`  ${niceName}: no models returned`);
      continue;
    }

    // Bulk-create models in one statement
    await prisma.vehicleModel.createMany({
      data: modelList.map((name) => ({
        makeId: makeRow.id,
        name,
        slug: slugify(name),
      })),
      skipDuplicates: true,
    });
    totalModels += modelList.length;

    // Fetch the model IDs back so we can create year rows
    const persistedModels = await prisma.vehicleModel.findMany({
      where: { makeId: makeRow.id },
      select: { id: true },
    });

    // Build year rows for each model
    const yearRows: { modelId: string; year: number }[] = [];
    for (const m of persistedModels) {
      for (let y = YEAR_START; y <= YEAR_END; y++) {
        yearRows.push({ modelId: m.id, year: y });
      }
    }
    if (yearRows.length > 0) {
      await prisma.vehicleYear.createMany({ data: yearRows, skipDuplicates: true });
      totalYears += yearRows.length;
    }

    console.log(`  ✔ ${niceName}: ${modelList.length} models`);
  }

  // Add generic engines, attached to any existing year row (FK requirement).
  // getVehicleEngines() returns distinct names, so the dropdown only shows 12.
  const anyYear = await prisma.vehicleYear.findFirst({
    where: { year: YEAR_END },
    select: { id: true },
  });
  let engineCount = 0;
  if (anyYear) {
    await prisma.vehicleEngine.createMany({
      data: GENERIC_ENGINES.map((name) => ({ yearId: anyYear.id, name })),
      skipDuplicates: true,
    });
    engineCount = GENERIC_ENGINES.length;
  }

  console.log("");
  console.log("Done. Vehicle data now:");
  console.log({
    makes: await prisma.vehicleMake.count(),
    models: await prisma.vehicleModel.count(),
    years: await prisma.vehicleYear.count(),
    engines: engineCount,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
