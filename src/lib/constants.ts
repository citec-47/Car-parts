export const SITE = {
  name: "RevParts",
  tagline: "Quality auto parts for every vehicle.",
  hotline: "+1 (800) 327-3782",
  email: "support@revparts.example",
  currency: "USD",
  currencySymbol: "$",
} as const;

export const SHIPPING = {
  freeShippingThresholdCents: 6000,
  flatRateCents: 999,
  todayOfferCode: "REV20",
  todayOfferText: "Today Offer: $20 OFF orders $300 or more with code REV20 + Free shipping on orders over $60",
} as const;

export type IconKey =
  | "body-parts"
  | "electronics"
  | "lightings"
  | "performance"
  | "repair-parts"
  | "suspensions"
  | "accessories"
  | "wheels-tires"
  | "tools-garage"
  | "engine-drivetrain";

export type HeaderCategory = {
  name: string;
  slug: string;
  iconKey: IconKey;
};

export const HEADER_CATEGORIES: HeaderCategory[] = [
  { name: "Body Parts", slug: "body-parts", iconKey: "body-parts" },
  { name: "Electronics", slug: "electronics", iconKey: "electronics" },
  { name: "Lightings", slug: "lightings", iconKey: "lightings" },
  { name: "Performance", slug: "performance", iconKey: "performance" },
  { name: "Repair Parts", slug: "repair-parts", iconKey: "repair-parts" },
  { name: "Suspensions", slug: "suspensions", iconKey: "suspensions" },
  { name: "Accessories", slug: "accessories", iconKey: "accessories" },
  { name: "Wheels & Tires", slug: "wheels-tires", iconKey: "wheels-tires" },
  { name: "Tools & Garage", slug: "tools-garage", iconKey: "tools-garage" },
  { name: "Engine & Drivetrain", slug: "engine-drivetrain", iconKey: "engine-drivetrain" },
];

export const POPULAR_CATEGORY_SLUGS = [
  "body-parts",
  "electronics",
  "lightings",
  "performance",
  "repair-parts",
  "suspensions",
] as const;

export const FEATURED_TAB_SLUGS = [
  "body-parts",
  "electronics",
  "lightings",
  "performance",
  "repair-parts",
] as const;

export const TRUST_BADGES = [
  {
    title: "Free Shipping",
    body: "Free worldwide shipping on all orders above $60.",
  },
  {
    title: "7 Days Easy Return",
    body: "Product any fault within 07 days for an immediately exchange.",
  },
  {
    title: "24/7 Friendly Support",
    body: "Our support team is always ready for you 7 days a week.",
  },
  {
    title: "Payment Secure",
    body: "We ensure 100% secure payment with Online Payment.",
  },
] as const;

export const MAIN_NAV = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "Inventory", href: "/inventory" },
  { name: "Categories", href: "/categories" },
  { name: "Quotation", href: "/quotation" },
  { name: "Contact us", href: "/contact" },
] as const;
