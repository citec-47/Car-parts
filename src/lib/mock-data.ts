import { HEADER_CATEGORIES } from "./constants";
import type { Category, Product, VehicleMake, VehicleModel, VehicleYearRow, VehicleEngineRow } from "./types";

export type { Category, Product, ProductImage, VehicleMake, VehicleModel, VehicleYearRow, VehicleEngineRow } from "./types";

export const MOCK_CATEGORIES: Category[] = HEADER_CATEGORIES.map((c, i) => ({
  id: `cat_${c.slug}`,
  name: c.name,
  slug: c.slug,
  description: null,
  iconKey: c.iconKey,
  displayOrder: i,
}));

const placeholder = (label: string) =>
  `https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=600&h=600&fit=crop&auto=format&txt=${encodeURIComponent(label)}`;

const tireImg = "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&h=800&fit=crop&auto=format";
const headlightImg = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=800&fit=crop&auto=format";
const engineImg = "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=800&fit=crop&auto=format";
const wheelImg = "https://images.unsplash.com/photo-1626668893632-6f3a4466d109?w=800&h=800&fit=crop&auto=format";
const brakeImg = "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=800&fit=crop&auto=format";

const HOT_DEAL_ENDS = new Date(Date.now() + 1000 * 60 * 60 * 24 * 4);

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p_1",
    name: "Thunderer Trac Grip M/T R408 285/75R16 126 Q Tire",
    slug: "thunderer-trac-grip-mt-r408-285-75r16",
    sku: "TRC-R408-28575R16",
    description:
      "Aggressive mud-terrain tread for off-road traction with solid on-road manners. 4-ply sidewall, 50,000-mile tread warranty.",
    brand: "Thunderer",
    priceCents: 1879,
    salePriceCents: null,
    stock: 24,
    rating: 5,
    reviewCount: 38,
    isFeatured: false,
    isHotDeal: true,
    hotDealEndsAt: HOT_DEAL_ENDS,
    categorySlug: "wheels-tires",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_1_img", url: tireImg, altText: "Thunderer M/T tire" }],
  },
  {
    id: "p_2",
    name: "Waterfall Eco Dynamic 205/55R16 94 W Tire",
    slug: "waterfall-eco-dynamic-205-55r16",
    sku: "WTR-ECO-20555R16",
    description: "Low rolling-resistance touring tire with excellent wet-grip rating.",
    brand: "Waterfall",
    priceCents: 1879,
    salePriceCents: null,
    stock: 60,
    rating: 3.5,
    reviewCount: 12,
    isFeatured: true,
    isHotDeal: false,
    hotDealEndsAt: null,
    categorySlug: "wheels-tires",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_2_img", url: tireImg, altText: "Waterfall touring tire" }],
  },
  {
    id: "p_3",
    name: "Westlake SL369 265/70R17 115 T Tire",
    slug: "westlake-sl369-265-70r17",
    sku: "WST-SL369-26570R17",
    description: "All-terrain SUV tire engineered for durability across mixed surfaces.",
    brand: "Westlake",
    priceCents: 1879,
    salePriceCents: null,
    stock: 18,
    rating: 4,
    reviewCount: 27,
    isFeatured: true,
    isHotDeal: false,
    hotDealEndsAt: null,
    categorySlug: "wheels-tires",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_3_img", url: tireImg, altText: "Westlake SUV tire" }],
  },
  {
    id: "p_4",
    name: "Hyper Tough Hydraulic Floor Jack Stand (3 Ton)",
    slug: "hyper-tough-jack-stand-3-ton",
    sku: "HT-JACK-3T",
    description: "Heavy-duty steel jack stands with self-locking ratchet. Sold as a pair.",
    brand: "Hyper Tough",
    priceCents: 1879,
    salePriceCents: null,
    stock: 42,
    rating: 4,
    reviewCount: 51,
    isFeatured: true,
    isHotDeal: false,
    hotDealEndsAt: null,
    categorySlug: "tools-garage",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_4_img", url: wheelImg, altText: "Hydraulic jack stand" }],
  },
  {
    id: "p_5",
    name: "Pro-Lift Z Creeper Creeper and Seat 3G",
    slug: "pro-lift-z-creeper-seat-3g",
    sku: "PL-ZCREEP-3G",
    description: "Convertible creeper-to-seat for shop use. Padded headrest, six 5-inch casters.",
    brand: "Pro-Lift",
    priceCents: 1879,
    salePriceCents: 1599,
    stock: 14,
    rating: 5,
    reviewCount: 19,
    isFeatured: true,
    isHotDeal: false,
    hotDealEndsAt: null,
    categorySlug: "tools-garage",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_5_img", url: engineImg, altText: "Pro-Lift creeper seat" }],
  },
  {
    id: "p_6",
    name: "ProBeam LED Headlight Assembly (Pair)",
    slug: "probeam-led-headlight-assembly-pair",
    sku: "PB-LED-HL-PR",
    description: "Direct-fit LED headlight assemblies with DRL halo ring. DOT-approved.",
    brand: "ProBeam",
    priceCents: 28900,
    salePriceCents: 23120,
    stock: 22,
    rating: 4.5,
    reviewCount: 86,
    isFeatured: true,
    isHotDeal: false,
    hotDealEndsAt: null,
    categorySlug: "lightings",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_6_img", url: headlightImg, altText: "LED headlights" }],
  },
  {
    id: "p_7",
    name: "PowerStop Z23 Brake Pad & Rotor Kit (Front)",
    slug: "powerstop-z23-front-brake-kit",
    sku: "PS-Z23-FRONT",
    description:
      "Carbon-fiber ceramic pads with drilled & slotted rotors. Includes hardware and brake fluid.",
    brand: "PowerStop",
    priceCents: 18999,
    salePriceCents: null,
    stock: 9,
    rating: 4.8,
    reviewCount: 145,
    isFeatured: true,
    isHotDeal: false,
    hotDealEndsAt: null,
    categorySlug: "repair-parts",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_7_img", url: brakeImg, altText: "PowerStop brake kit" }],
  },
  {
    id: "p_8",
    name: "Carbon Fiber Front Bumper Lip Spoiler (Universal)",
    slug: "carbon-fiber-bumper-lip-spoiler",
    sku: "CF-BMP-LIP-U",
    description: "Real carbon-fiber 5-piece front lip kit. Universal fit, tape-on installation.",
    brand: "ApexCarbon",
    priceCents: 12999,
    salePriceCents: 9999,
    stock: 31,
    rating: 4.2,
    reviewCount: 64,
    isFeatured: false,
    isHotDeal: false,
    hotDealEndsAt: null,
    categorySlug: "body-parts",
    priceOnRequest: false,
    specs: [],
    images: [{ id: "p_8_img", url: placeholder("Bumper Lip"), altText: "Carbon fiber bumper lip" }],
  },
];

// ---------- Vehicle fitment mock ----------

export const MOCK_MAKES: VehicleMake[] = [
  { id: "mk_toyota", name: "Toyota", slug: "toyota" },
  { id: "mk_ford", name: "Ford", slug: "ford" },
  { id: "mk_honda", name: "Honda", slug: "honda" },
  { id: "mk_chevy", name: "Chevrolet", slug: "chevrolet" },
  { id: "mk_bmw", name: "BMW", slug: "bmw" },
];

export const MOCK_MODELS: VehicleModel[] = [
  { id: "md_camry", makeId: "mk_toyota", name: "Camry", slug: "camry" },
  { id: "md_corolla", makeId: "mk_toyota", name: "Corolla", slug: "corolla" },
  { id: "md_tacoma", makeId: "mk_toyota", name: "Tacoma", slug: "tacoma" },
  { id: "md_f150", makeId: "mk_ford", name: "F-150", slug: "f-150" },
  { id: "md_mustang", makeId: "mk_ford", name: "Mustang", slug: "mustang" },
  { id: "md_civic", makeId: "mk_honda", name: "Civic", slug: "civic" },
  { id: "md_accord", makeId: "mk_honda", name: "Accord", slug: "accord" },
  { id: "md_silverado", makeId: "mk_chevy", name: "Silverado", slug: "silverado" },
  { id: "md_3series", makeId: "mk_bmw", name: "3 Series", slug: "3-series" },
];

export const MOCK_YEARS: VehicleYearRow[] = (() => {
  const rows: VehicleYearRow[] = [];
  for (const m of MOCK_MODELS) {
    for (let y = 2015; y <= 2025; y++) {
      rows.push({ id: `yr_${m.id}_${y}`, modelId: m.id, year: y });
    }
  }
  return rows;
})();

export const MOCK_ENGINES: VehicleEngineRow[] = [
  { id: "en_2_0l_i4", yearId: "any", name: "2.0L I4" },
  { id: "en_2_5l_i4", yearId: "any", name: "2.5L I4" },
  { id: "en_3_5l_v6", yearId: "any", name: "3.5L V6" },
  { id: "en_5_0l_v8", yearId: "any", name: "5.0L V8" },
];
