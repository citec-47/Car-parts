/**
 * Demo-catalog seed: populates the store with hundreds of synthetic but
 * realistic-looking car-engine and parts listings across 10 categories.
 *
 * Run:   npm run seed:demo
 *
 * - Categories are upserted by slug (re-runs don't duplicate them).
 * - Products are upserted by SKU (re-runs update existing rather than dupe).
 * - Images reference Unsplash URLs (already in next.config.ts allowlist) —
 *   no Cloudinary uploads, so the seed is fast (<1 min for ~600 products).
 * - About 10% are flagged as Hot Deals and another 15% as Featured.
 *
 * WARNING: these are placeholder listings, not real inventory. Customers who
 * order them won't get anything shipped. Mark them inactive or replace with
 * real products before going live.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Deterministic-ish PRNG so a re-seed produces the same data
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0xDEADBEEF);
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

// ---------- Image pools (themed Unsplash photos, no copyrighted dealer art) ----------

// Curated Unsplash car/automotive photos. Each pool has ~10 images so
// the variety of products in a category doesn't repeat the same picture.
const U = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=800&fit=crop&auto=format`;

const IMG = {
  engine: [
    U("photo-1517524008697-84bbe3c3fd98"), // engine bay
    U("photo-1486006920555-c77dcf18193c"), // engine close
    U("photo-1632823469850-1b7b6e85d4a6"), // mechanic engine
    U("photo-1581092335397-9fa73d2d7b6f"), // auto repair garage
    U("photo-1635774855536-9728f2610245"), // engine internals
    U("photo-1601584115197-04ecc0da31d7"), // car engine
    U("photo-1494976388531-d1058494cdd8"), // car detail
    U("photo-1542319630-9c14f1d2bb6c"), // engine bay 2
    U("photo-1492144534655-ae79c964c9d7"), // mechanic at work
    U("photo-1530546171585-bd44c20ee0b6"), // engine block
  ],
  tire: [
    U("photo-1486006920555-c77dcf18193c"),
    U("photo-1626668893632-6f3a4466d109"), // wheel
    U("photo-1605164599901-db7f68c4b3a3"),
    U("photo-1492144534655-ae79c964c9d7"),
    U("photo-1611821064430-0d40291922d0"), // tire rack
    U("photo-1572276596237-5db2c3e16c5d"), // alloy wheel
    U("photo-1568605114967-8130f3a36994"), // car wheel detail
    U("photo-1503376780353-7e6692767b70"),
  ],
  headlight: [
    U("photo-1494976388531-d1058494cdd8"), // headlight
    U("photo-1492144534655-ae79c964c9d7"),
    U("photo-1583121274602-3e2820c69888"), // headlight LED
    U("photo-1542362567-b07e54358753"), // car front
    U("photo-1574023322083-c4c1e90f3aa8"), // headlight detail
    U("photo-1606664515524-ed2f786a0bd6"), // halo headlight
    U("photo-1517524008697-84bbe3c3fd98"),
  ],
  brake: [
    U("photo-1581092918056-0c4c3acd3789"), // brake disc
    U("photo-1486754735734-325b5831c3ad"),
    U("photo-1486006920555-c77dcf18193c"),
    U("photo-1623069495447-22a5c9be7b88"), // brake caliper
    U("photo-1599256633961-77fc0b9d7f7b"), // brake rotors
    U("photo-1581092335397-9fa73d2d7b6f"),
    U("photo-1517524008697-84bbe3c3fd98"),
  ],
  body: [
    U("photo-1492144534655-ae79c964c9d7"), // car body
    U("photo-1503376780353-7e6692767b70"), // car detail
    U("photo-1542319630-9c14f1d2bb6c"),
    U("photo-1552519507-da3b142c6e3d"), // car body work
    U("photo-1606016264555-7ce99cdb20b9"), // car part painted
    U("photo-1568605114967-8130f3a36994"),
    U("photo-1494976388531-d1058494cdd8"),
  ],
  tools: [
    U("photo-1530124566582-a618bc2615dc"), // tools on bench
    U("photo-1591805985000-0bc4d2d4b6a6"),
    U("photo-1581092335397-9fa73d2d7b6f"), // garage
    U("photo-1572883454114-1cf0031ede2a"), // wrenches
    U("photo-1581092628326-71b94ade8f6e"), // toolbox
    U("photo-1581092918056-0c4c3acd3789"),
    U("photo-1567361808960-dec9cb578182"), // socket set
  ],
  electronics: [
    U("photo-1591488320449-011701bb6704"), // OBD scanner
    U("photo-1581092918056-0c4c3acd3789"),
    U("photo-1542319630-9c14f1d2bb6c"),
    U("photo-1581092335397-9fa73d2d7b6f"),
    U("photo-1606664515524-ed2f786a0bd6"),
    U("photo-1611174243309-1f1e1eed8e3a"), // dashboard
    U("photo-1517524008697-84bbe3c3fd98"),
  ],
  exhaust: [
    U("photo-1581092918056-0c4c3acd3789"), // tail pipe
    U("photo-1517524008697-84bbe3c3fd98"),
    U("photo-1605635543678-2c61c3c1ed4d"), // exhaust pipe
    U("photo-1492144534655-ae79c964c9d7"),
    U("photo-1601584115197-04ecc0da31d7"),
    U("photo-1581092335397-9fa73d2d7b6f"),
    U("photo-1486006920555-c77dcf18193c"),
  ],
};

// ---------- Category definitions ----------

const CATEGORIES = [
  { name: "JDM Engines", slug: "jdm-engines", iconKey: "engine-drivetrain", displayOrder: 0 },
  { name: "Transmissions & Drivetrain", slug: "transmissions-drivetrain", iconKey: "engine-drivetrain", displayOrder: 10 },
  { name: "Engine Parts", slug: "engine-parts", iconKey: "performance", displayOrder: 20 },
  { name: "Brakes & Suspension", slug: "brakes-suspension", iconKey: "suspensions", displayOrder: 30 },
  { name: "Body Parts", slug: "body-parts", iconKey: "body-parts", displayOrder: 40 },
  { name: "Lighting", slug: "lighting", iconKey: "lightings", displayOrder: 50 },
  { name: "Wheels & Tires", slug: "wheels-tires", iconKey: "wheels-tires", displayOrder: 60 },
  { name: "Exhaust & Intake", slug: "exhaust-intake", iconKey: "performance", displayOrder: 70 },
  { name: "Electronics", slug: "electronics", iconKey: "electronics", displayOrder: 80 },
  { name: "Tools & Garage", slug: "tools-garage", iconKey: "tools-garage", displayOrder: 90 },
];

// ---------- Engine model catalog ----------

const ENGINES = [
  // Honda
  { brand: "Honda", code: "B16A", desc: "1.6L DOHC VTEC", basePrice: 1850 },
  { brand: "Honda", code: "B16A2", desc: "1.6L DOHC VTEC", basePrice: 1950 },
  { brand: "Honda", code: "B16B", desc: "1.6L DOHC VTEC (Type R)", basePrice: 2450 },
  { brand: "Honda", code: "B18C", desc: "1.8L DOHC VTEC", basePrice: 2200 },
  { brand: "Honda", code: "B18C5", desc: "1.8L DOHC VTEC (Type R)", basePrice: 2950 },
  { brand: "Honda", code: "B20B", desc: "2.0L DOHC", basePrice: 1450 },
  { brand: "Honda", code: "B20Z", desc: "2.0L DOHC", basePrice: 1550 },
  { brand: "Honda", code: "K20A", desc: "2.0L i-VTEC", basePrice: 2800 },
  { brand: "Honda", code: "K20A2", desc: "2.0L i-VTEC", basePrice: 2900 },
  { brand: "Honda", code: "K20Z", desc: "2.0L i-VTEC", basePrice: 2700 },
  { brand: "Honda", code: "K24A", desc: "2.4L i-VTEC", basePrice: 2400 },
  { brand: "Honda", code: "F20C", desc: "2.0L DOHC VTEC", basePrice: 3400 },
  { brand: "Honda", code: "F22C", desc: "2.2L DOHC VTEC", basePrice: 3500 },
  { brand: "Honda", code: "F23A", desc: "2.3L VTEC", basePrice: 850 },
  { brand: "Honda", code: "H22A", desc: "2.2L DOHC VTEC", basePrice: 1700 },
  { brand: "Honda", code: "H23A", desc: "2.3L DOHC", basePrice: 1300 },
  { brand: "Honda", code: "J32A", desc: "3.2L V6", basePrice: 1850 },
  { brand: "Honda", code: "J35A", desc: "3.5L V6", basePrice: 1950 },
  // Toyota
  { brand: "Toyota", code: "1JZ-GTE", desc: "2.5L Twin-Turbo DOHC", basePrice: 2800 },
  { brand: "Toyota", code: "2JZ-GE", desc: "3.0L Inline-6", basePrice: 1900 },
  { brand: "Toyota", code: "2JZ-GTE", desc: "3.0L Twin-Turbo Inline-6", basePrice: 4500 },
  { brand: "Toyota", code: "3S-GTE", desc: "2.0L Turbo DOHC", basePrice: 2400 },
  { brand: "Toyota", code: "3S-GE BEAMS", desc: "2.0L DOHC", basePrice: 1800 },
  { brand: "Toyota", code: "4A-GE", desc: "1.6L DOHC (20-valve)", basePrice: 1750 },
  { brand: "Toyota", code: "4A-GZE", desc: "1.6L Supercharged DOHC", basePrice: 2100 },
  { brand: "Toyota", code: "5VZ-FE", desc: "3.4L V6 DOHC", basePrice: 1450 },
  { brand: "Toyota", code: "7M-GTE", desc: "3.0L Turbo Inline-6", basePrice: 1850 },
  { brand: "Toyota", code: "1UZ-FE", desc: "4.0L V8 DOHC", basePrice: 1650 },
  { brand: "Toyota", code: "2UZ-FE", desc: "4.7L V8 DOHC", basePrice: 1750 },
  // Nissan
  { brand: "Nissan", code: "SR20DE", desc: "2.0L DOHC", basePrice: 1450 },
  { brand: "Nissan", code: "SR20DET", desc: "2.0L Turbo DOHC", basePrice: 2750 },
  { brand: "Nissan", code: "SR20VE", desc: "2.0L Neo VVL DOHC", basePrice: 1850 },
  { brand: "Nissan", code: "CA18DET", desc: "1.8L Turbo DOHC", basePrice: 1750 },
  { brand: "Nissan", code: "RB20DET", desc: "2.0L Turbo Inline-6", basePrice: 2150 },
  { brand: "Nissan", code: "RB25DET", desc: "2.5L Turbo Inline-6", basePrice: 2950 },
  { brand: "Nissan", code: "RB26DETT", desc: "2.6L Twin-Turbo Inline-6", basePrice: 5500 },
  { brand: "Nissan", code: "VG30DETT", desc: "3.0L Twin-Turbo V6", basePrice: 2850 },
  { brand: "Nissan", code: "VQ35DE", desc: "3.5L V6 DOHC", basePrice: 1750 },
  { brand: "Nissan", code: "KA24DE", desc: "2.4L DOHC", basePrice: 1100 },
  // Mazda
  { brand: "Mazda", code: "13B-REW", desc: "1.3L Twin-Rotor Turbo", basePrice: 3200 },
  { brand: "Mazda", code: "13B-RE", desc: "1.3L Twin-Rotor", basePrice: 2400 },
  { brand: "Mazda", code: "20B-REW", desc: "2.0L Triple-Rotor Turbo", basePrice: 8500 },
  { brand: "Mazda", code: "FE3", desc: "2.0L DOHC", basePrice: 1250 },
  { brand: "Mazda", code: "FS-DE", desc: "2.0L DOHC", basePrice: 1350 },
  { brand: "Mazda", code: "BP-ZE", desc: "1.8L DOHC", basePrice: 1450 },
  // Subaru
  { brand: "Subaru", code: "EJ20K", desc: "2.0L Turbo Boxer", basePrice: 2450 },
  { brand: "Subaru", code: "EJ207", desc: "2.0L Turbo Boxer (STI)", basePrice: 3200 },
  { brand: "Subaru", code: "EJ25", desc: "2.5L Boxer", basePrice: 1750 },
  { brand: "Subaru", code: "EJ257", desc: "2.5L Turbo Boxer (STI)", basePrice: 3450 },
  { brand: "Subaru", code: "EJ255", desc: "2.5L Turbo Boxer", basePrice: 2950 },
  { brand: "Subaru", code: "EZ30", desc: "3.0L Flat-6", basePrice: 1850 },
  // Mitsubishi
  { brand: "Mitsubishi", code: "4G63T", desc: "2.0L Turbo DOHC", basePrice: 2750 },
  { brand: "Mitsubishi", code: "4G63", desc: "2.0L DOHC", basePrice: 1450 },
  { brand: "Mitsubishi", code: "6G72", desc: "3.0L V6 DOHC", basePrice: 1650 },
  { brand: "Mitsubishi", code: "4B11T", desc: "2.0L Turbo MIVEC", basePrice: 3450 },
  { brand: "Mitsubishi", code: "4G64", desc: "2.4L DOHC", basePrice: 1350 },
];

const YEAR_RANGES = [
  "1989-1994",
  "1992-1996",
  "1994-1998",
  "1996-2000",
  "1998-2002",
  "2000-2005",
  "2003-2008",
  "2005-2010",
  "2008-2012",
];

const CYL = (code: string): number => {
  if (/RB|JZ|UZ|VG|VQ/i.test(code)) return 6;
  if (/EJ|EZ/i.test(code)) return 4;
  if (/UZ|VG|VQ/i.test(code)) return 8;
  if (/13B|20B/i.test(code)) return 0; // rotary
  return 4;
};

function engineDescription(e: { brand: string; code: string; desc: string }, year: string): string {
  const cyl = CYL(e.code);
  const cylText = cyl === 0 ? "Rotary" : `${cyl}-cylinder`;
  const sentences = [
    `Authentic JDM ${e.brand} ${e.code} engine, ${e.desc}, ${cylText}, imported from Japan with verified low mileage.`,
    `Compression-tested and ready to install. Includes engine, intake manifold, throttle body, ignition coils, sensors, and original wiring harness where available.`,
    `Suitable for vehicles in the ${year} year range and most direct-fit swaps that share the ${e.code} platform.`,
    `Sold as-is with our standard 30-day warranty against major mechanical failure.`,
  ];
  return sentences.join(" ");
}

// ---------- Parts catalogs ----------

const TRANSMISSIONS = [
  ["5-Speed Manual Transmission", "5MT", 850],
  ["6-Speed Manual Transmission", "6MT", 1250],
  ["6-Speed Manual w/ LSD", "6MT-LSD", 1850],
  ["Automatic Transmission (4-Speed)", "4AT", 750],
  ["Automatic Transmission (5-Speed)", "5AT", 950],
  ["Sequential Manual Transmission", "SEQ-MT", 3850],
  ["CVT Transmission", "CVT", 1450],
  ["Twin-Disc Clutch Kit", "CLUTCH-TD", 850],
  ["Single-Disc Sport Clutch Kit", "CLUTCH-SS", 450],
  ["Lightweight Flywheel (Steel)", "FLYWHEEL-S", 380],
  ["Lightweight Flywheel (Aluminum)", "FLYWHEEL-A", 480],
  ["Short Shifter Kit", "SHIFTER-S", 220],
  ["Differential (LSD)", "DIFF-LSD", 1450],
  ["Driveshaft (Carbon Fiber)", "DS-CF", 1850],
  ["CV Axle (Front Left)", "AXLE-FL", 220],
  ["CV Axle (Front Right)", "AXLE-FR", 220],
  ["Transfer Case (AWD)", "T-CASE", 1850],
  ["Transmission Mount Set", "MOUNT-T", 280],
] as const;

const ENGINE_PARTS = [
  ["Turbocharger T3/T4", "TURBO-T34", 750],
  ["Garrett GT2871R Turbo", "TURBO-GT", 1450],
  ["Precision PT6266 Turbo", "TURBO-PT", 1750],
  ["Wastegate (38mm External)", "WG-38", 320],
  ["Blow-Off Valve", "BOV-1", 180],
  ["Intercooler (Front-Mount)", "FMIC", 480],
  ["Intercooler Piping Kit", "IC-PIPE", 280],
  ["Fuel Injectors (550cc)", "INJ-550", 480],
  ["Fuel Injectors (1000cc)", "INJ-1000", 580],
  ["Fuel Rail Kit", "FUEL-RAIL", 280],
  ["Fuel Pressure Regulator", "FPR", 180],
  ["High-Flow Fuel Pump", "FPUMP", 380],
  ["Forged Pistons Set", "PISTON-F", 850],
  ["Connecting Rods (H-Beam)", "RODS-H", 950],
  ["Camshafts (Stage 2)", "CAM-S2", 750],
  ["Cylinder Head (Ported)", "HEAD-P", 1850],
  ["Intake Manifold (Polished)", "IM-P", 380],
  ["Throttle Body (70mm)", "TB-70", 280],
  ["Spark Plug Set (Iridium)", "PLUG-IR", 80],
  ["Ignition Coil Pack Set", "COIL-SET", 280],
  ["Oil Pan (Baffled)", "OIL-PAN", 380],
  ["Oil Cooler Kit", "OIL-COOL", 380],
  ["Radiator (Aluminum)", "RAD-AL", 280],
  ["Radiator Hose Kit", "RAD-HOSE", 120],
  ["Thermostat (Low-Temp)", "TSTAT-LT", 80],
  ["Engine Mount Set (Polyurethane)", "ENG-MNT", 380],
  ["Timing Belt Kit", "TB-KIT", 220],
  ["Water Pump", "WPUMP", 180],
] as const;

const BRAKES_SUSPENSION = [
  ["Coilover Kit (Adjustable)", "COIL-ADJ", 880],
  ["Coilover Kit (Track-Spec)", "COIL-TRK", 1480],
  ["Lowering Spring Set", "SPRING-LOW", 280],
  ["Sway Bar Kit (Front+Rear)", "SWAY-FR", 320],
  ["Strut Brace (Front)", "BRACE-F", 220],
  ["Strut Brace (Rear)", "BRACE-R", 220],
  ["Camber Kit (Rear)", "CAMBER-R", 280],
  ["Caster Kit (Front)", "CASTER-F", 320],
  ["Brake Pad Set (Performance)", "PAD-P", 180],
  ["Brake Pad Set (Track)", "PAD-T", 280],
  ["Brake Rotor Set (Drilled)", "ROTOR-D", 220],
  ["Brake Rotor Set (Slotted)", "ROTOR-S", 240],
  ["Big Brake Kit (4-Piston)", "BBK-4P", 1280],
  ["Big Brake Kit (6-Piston)", "BBK-6P", 1780],
  ["Stainless Steel Brake Lines", "BLINE-SS", 180],
  ["Brake Master Cylinder", "BMC", 280],
  ["Brake Booster", "BBOOST", 220],
  ["Polyurethane Bushing Kit", "BUSH-PU", 380],
] as const;

const BODY_PARTS = [
  ["Carbon Fiber Hood", "HOOD-CF", 1280],
  ["Vented Steel Hood", "HOOD-VS", 480],
  ["Front Bumper", "BUMP-F", 480],
  ["Rear Bumper", "BUMP-R", 480],
  ["Front Lip Spoiler", "LIP-F", 280],
  ["Rear Diffuser", "DIFF-R", 380],
  ["Side Skirts (Pair)", "SKIRT-P", 380],
  ["Carbon Fiber Roof", "ROOF-CF", 1880],
  ["Wide-Body Fender Flares", "FENDER-WB", 580],
  ["Door Card (Carbon Fiber)", "DOOR-CF", 480],
  ["Side Mirror (Carbon)", "MIRROR-CF", 220],
  ["Spoiler (Trunk Lip)", "SPOIL-TL", 220],
  ["Spoiler (GT Wing)", "SPOIL-GT", 580],
  ["Window Visor Kit", "VISOR-K", 80],
  ["Door Handle Set (Black)", "HANDLE-B", 120],
  ["Hood Pin Kit", "PIN-HOOD", 60],
  ["Tow Hook (Red)", "TOW-R", 60],
] as const;

const LIGHTING = [
  ["LED Headlight Assembly (Pair)", "HL-LED", 480],
  ["HID Conversion Kit", "HID-KIT", 180],
  ["Halo Ring LED Headlights", "HL-HALO", 380],
  ["Smoked Tail Light Set", "TL-SMOKE", 280],
  ["LED Tail Light Set", "TL-LED", 380],
  ["Sequential Turn Signal Mod", "SIG-SEQ", 120],
  ["Fog Light Kit (LED)", "FOG-LED", 180],
  ["Light Bar (32-inch)", "LB-32", 280],
  ["Light Bar (50-inch)", "LB-50", 480],
  ["Interior LED Kit", "INT-LED", 60],
  ["Underglow LED Kit (RGB)", "UG-RGB", 180],
  ["License Plate LED", "LP-LED", 20],
  ["Side Marker LED", "SM-LED", 30],
  ["DRL Strip Kit", "DRL-K", 80],
] as const;

const WHEELS_TIRES = [
  ['17" Forged Wheel Set', "WHL-17F", 1480],
  ['18" Forged Wheel Set', "WHL-18F", 1680],
  ['19" Forged Wheel Set', "WHL-19F", 1880],
  ['17" Cast Wheel Set', "WHL-17C", 680],
  ['18" Cast Wheel Set', "WHL-18C", 780],
  ['19" Cast Wheel Set', "WHL-19C", 880],
  ['Track Tire 245/40R18', "TIRE-2454018", 280],
  ['Sport Tire 225/45R17', "TIRE-2254517", 220],
  ['All-Season Tire 215/55R17', "TIRE-2155517", 180],
  ['Performance Tire 235/35R19', "TIRE-2353519", 320],
  ["Lug Nut Set (Forged)", "LUGNUT-F", 80],
  ["Wheel Spacer Kit (15mm)", "SPACER-15", 80],
  ["Wheel Spacer Kit (20mm)", "SPACER-20", 90],
  ["TPMS Sensor Set", "TPMS-S", 180],
  ["Center Cap Set (Custom)", "CAP-C", 60],
] as const;

const EXHAUST_INTAKE = [
  ["Catback Exhaust System", "EXH-CB", 580],
  ["Axleback Exhaust", "EXH-AB", 380],
  ["Header (4-1)", "HEADER-41", 380],
  ["Header (Twin Scroll)", "HEADER-TS", 480],
  ["Test Pipe (Catless)", "TP-CL", 180],
  ["High-Flow Cat Pipe", "CAT-HF", 280],
  ["Cold Air Intake Kit", "CAI", 280],
  ["Short Ram Intake", "SRI", 180],
  ["K&N Drop-In Filter", "FILT-KN", 60],
  ["Race Air Filter (Foam)", "FILT-R", 80],
  ["Resonator Delete Pipe", "RES-DEL", 120],
  ["Muffler (Single-Tip)", "MUFF-1T", 180],
  ["Muffler (Dual-Tip)", "MUFF-2T", 220],
  ["Exhaust Manifold Heat Wrap", "WRAP-EM", 60],
  ["Velocity Stacks Set", "VS-SET", 220],
] as const;

const ELECTRONICS = [
  ["Standalone ECU (Hondata)", "ECU-HND", 1280],
  ["Standalone ECU (AEM)", "ECU-AEM", 1180],
  ["Standalone ECU (Haltech)", "ECU-HLT", 1380],
  ["Boost Controller (Electronic)", "EBC", 380],
  ["Wideband O2 Kit", "WB-O2", 280],
  ["Air/Fuel Ratio Gauge", "GAUGE-AFR", 180],
  ["Boost Gauge (60mm)", "GAUGE-B", 120],
  ["Oil Pressure Gauge", "GAUGE-OP", 120],
  ["Coolant Temp Gauge", "GAUGE-CT", 120],
  ["EGT Probe + Gauge", "EGT-K", 220],
  ["Multi-Gauge Cluster", "CLUSTER", 580],
  ["Heads-Up Display (HUD)", "HUD", 320],
  ["Reverse Camera Kit", "RCAM", 180],
  ["Dash Camera (4K)", "DCAM-4K", 280],
  ["Wiring Harness (Race)", "HARN-R", 480],
  ["Battery Relocation Kit", "BATT-REL", 180],
  ["Lightweight Battery (Lithium)", "BATT-LI", 380],
  ["Alternator (High-Output)", "ALT-HO", 380],
] as const;

const TOOLS = [
  ["3-Ton Floor Jack", "JACK-3T", 220],
  ["Jack Stand Pair (3-Ton)", "STAND-3T", 80],
  ["Engine Hoist (2-Ton)", "HOIST-2T", 380],
  ["Engine Stand", "STAND-ENG", 180],
  ["Hydraulic Press (12-Ton)", "PRESS-12T", 480],
  ["Compression Tester Kit", "TEST-CMP", 80],
  ["OBD-II Scanner (Pro)", "OBD-PRO", 280],
  ["Torque Wrench (1/2-Drive)", "TW-12", 180],
  ["Socket Set (Master)", "SOCK-M", 220],
  ["Impact Wrench (Cordless)", "IMP-CL", 280],
  ["Air Compressor (30-Gal)", "COMP-30", 480],
  ["Welder (MIG, 220V)", "WELD-MIG", 580],
  ["Plasma Cutter (40A)", "CUT-PL", 480],
  ["Brake Bleeder Kit", "BLEED-K", 80],
  ["Timing Light", "T-LIGHT", 120],
  ["Multimeter (Pro)", "MM-PRO", 80],
  ["Creeper Seat (Padded)", "CREEP-P", 80],
  ["Tool Cabinet (7-Drawer)", "CAB-7D", 580],
] as const;

// ---------- Generator helpers ----------

type ParsedPart = readonly [name: string, sku: string, price: number];

function makeProduct(args: {
  name: string;
  sku: string;
  description: string;
  brand: string | null;
  priceCents: number;
  categoryId: string;
  imagePool: string[];
}) {
  const salePriceCents =
    rand() < 0.18 ? Math.round(args.priceCents * (0.65 + rand() * 0.2)) : null;
  const isFeatured = rand() < 0.15;
  const isHotDeal = salePriceCents != null && rand() < 0.55;
  const stock = randInt(1, 30);

  // 1-3 images per product, all from the curated themed Unsplash pool.
  // We don't dedupe across the picks — same image twice in one product is fine
  // and unlikely given the pool size.
  const imgCount = randInt(1, 3);
  const images: { url: string; displayOrder: number }[] = [];
  for (let i = 0; i < imgCount; i++) {
    images.push({ url: pick(args.imagePool), displayOrder: i });
  }

  return {
    name: args.name,
    slug: slugify(args.name) + "-" + args.sku.toLowerCase(),
    sku: args.sku,
    description: args.description,
    brand: args.brand,
    priceCents: args.priceCents,
    salePriceCents,
    stock,
    isActive: true,
    isFeatured: isFeatured && !isHotDeal,
    isHotDeal,
    categoryId: args.categoryId,
    images,
  };
}

function genericDescription(name: string, kind: string): string {
  const lines = [
    `${name} — professional-grade ${kind} for performance enthusiasts.`,
    `Direct fitment for most platforms; check compatibility before installation.`,
    `Sold individually unless specified as a kit. Hardware included where applicable.`,
    `Backed by our standard 30-day return policy.`,
  ];
  return lines.join(" ");
}

// ---------- Main ----------

async function main() {
  console.log("Seeding demo catalog…");
  console.log("");

  // Categories
  const catMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        iconKey: c.iconKey,
        displayOrder: c.displayOrder,
        showInFooter: true,
      },
      create: {
        name: c.name,
        slug: c.slug,
        iconKey: c.iconKey,
        displayOrder: c.displayOrder,
        showInFooter: true,
      },
    });
    catMap.set(c.slug, row.id);
  }
  console.log(`✔ ${CATEGORIES.length} categories upserted`);

  let total = 0;

  // Engines — each engine × year-range variant
  const engineCatId = catMap.get("jdm-engines")!;
  for (const e of ENGINES) {
    for (const yr of YEAR_RANGES.slice(0, randInt(2, 4))) {
      const name = `JDM ${e.brand} ${e.code} Engine ${yr} — ${e.desc}`;
      const sku = `${e.brand.toUpperCase()}-${e.code}-${yr.replace(/-/g, "")}`;
      const priceCents = (e.basePrice + randInt(-150, 150)) * 100;
      await upsertProduct(
        makeProduct({
          name,
          sku,
          description: engineDescription(e, yr),
          brand: e.brand,
          priceCents,
          categoryId: engineCatId,
          imagePool: IMG.engine,
        }),
      );
      total++;
    }
  }
  console.log(`✔ ${total} engine listings`);

  // Helper to seed a flat parts list under a category
  async function seedParts(
    parts: readonly ParsedPart[],
    categorySlug: string,
    kind: string,
    imagePool: string[],
    skuPrefix: string,
    brands: string[],
  ) {
    let count = 0;
    const catId = catMap.get(categorySlug)!;
    // Multiply each part across several brands for catalog volume
    for (const [name, baseSku, basePrice] of parts) {
      for (const brand of brands) {
        const fullSku = `${skuPrefix}-${baseSku}-${brand.toUpperCase().slice(0, 3)}`;
        const fullName = `${brand} ${name}`;
        await upsertProduct(
          makeProduct({
            name: fullName,
            sku: fullSku,
            description: genericDescription(fullName, kind),
            brand,
            priceCents: (basePrice + randInt(-30, 80)) * 100,
            categoryId: catId,
            imagePool,
          }),
        );
        count++;
      }
    }
    console.log(`✔ ${count.toString().padStart(4, " ")} listings in ${categorySlug}`);
    return count;
  }

  total += await seedParts(
    TRANSMISSIONS,
    "transmissions-drivetrain",
    "transmission / drivetrain component",
    IMG.engine,
    "TRANS",
    ["JDM-Spec", "Cusco", "ATS", "OS Giken"],
  );
  total += await seedParts(
    ENGINE_PARTS,
    "engine-parts",
    "engine component",
    IMG.engine,
    "EP",
    ["Garrett", "GReddy", "HKS", "Tomei", "Mishimoto"],
  );
  total += await seedParts(
    BRAKES_SUSPENSION,
    "brakes-suspension",
    "brake or suspension component",
    IMG.brake,
    "BS",
    ["TEIN", "KW", "Brembo", "Stoptech", "Cusco"],
  );
  total += await seedParts(
    BODY_PARTS,
    "body-parts",
    "exterior / body panel",
    IMG.body,
    "BP",
    ["VeilSide", "TRD", "Mugen", "Nismo", "ApexCarbon"],
  );
  total += await seedParts(
    LIGHTING,
    "lighting",
    "lighting product",
    IMG.headlight,
    "LT",
    ["ProBeam", "Spec-D", "Spyder", "Diode Dynamics"],
  );
  total += await seedParts(
    WHEELS_TIRES,
    "wheels-tires",
    "wheel or tire product",
    IMG.tire,
    "WT",
    ["Volk Racing", "Work", "Enkei", "BBS", "Falken", "Yokohama"],
  );
  total += await seedParts(
    EXHAUST_INTAKE,
    "exhaust-intake",
    "exhaust or intake component",
    IMG.exhaust,
    "EI",
    ["HKS", "GReddy", "Tomei", "Apexi", "Tanabe"],
  );
  total += await seedParts(
    ELECTRONICS,
    "electronics",
    "electronic device or sensor",
    IMG.electronics,
    "EL",
    ["AEM", "Haltech", "Hondata", "Defi", "Innovate"],
  );
  total += await seedParts(
    TOOLS,
    "tools-garage",
    "shop tool or equipment",
    IMG.tools,
    "TG",
    ["Snap-On", "Matco", "Harbor Freight", "Pro-Lift", "OTC"],
  );

  console.log("");
  console.log(`Done. Total products in DB now:`);
  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    images: await prisma.productImage.count(),
    featured: await prisma.product.count({ where: { isFeatured: true } }),
    hotDeals: await prisma.product.count({ where: { isHotDeal: true } }),
  };
  console.log(counts);
}

async function upsertProduct(p: ReturnType<typeof makeProduct>) {
  const { images, ...productData } = p;
  await prisma.product.upsert({
    where: { sku: productData.sku },
    update: productData,
    create: {
      ...productData,
      images: { create: images },
    },
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
