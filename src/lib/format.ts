import { SITE } from "./constants";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: SITE.currency,
});

export function formatPrice(cents: number): string {
  return usdFormatter.format(cents / 100);
}

export function calculateShipping(subtotalCents: number, freeOver: number, flatRate: number): number {
  return subtotalCents >= freeOver ? 0 : flatRate;
}

export function calculateDiscountPercent(priceCents: number, salePriceCents: number): number {
  if (!priceCents || salePriceCents >= priceCents) return 0;
  return Math.round(((priceCents - salePriceCents) / priceCents) * 100);
}

export function formatOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RP-${ts}-${rand}`;
}
