import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { getEngineOfTheWeek } from "@/lib/data";
import { formatPrice, calculateDiscountPercent } from "@/lib/format";
import { SectionHeading } from "./SectionHeading";
import { AddToCartButton } from "../product/AddToCartButton";

export async function FeaturedEngineOfTheWeek() {
  let product: Awaited<ReturnType<typeof getEngineOfTheWeek>> = null;
  try {
    product = await getEngineOfTheWeek();
  } catch (err) {
    console.error("[FeaturedEngineOfTheWeek] DB lookup failed:", err);
  }

  if (!product) return null;

  const cover = product.images[0];
  const discount = product.salePriceCents
    ? calculateDiscountPercent(product.priceCents, product.salePriceCents)
    : 0;
  const topSpecs = product.specs.slice(0, 4);
  const blurb = product.description.length > 240
    ? product.description.slice(0, 240).trimEnd() + "…"
    : product.description;

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionHeading>Engine of the Week</SectionHeading>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          {/* Image side */}
          <div className="relative aspect-square lg:aspect-auto lg:min-h-[480px] bg-muted">
            {cover ? (
              <Image
                src={cover.url}
                alt={cover.altText ?? product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : null}

            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-foreground shadow">
              <Sparkles className="h-3.5 w-3.5" />
              Featured
            </span>
            {discount > 0 ? (
              <span className="absolute left-4 top-14 inline-flex items-center rounded-md bg-amber-500 px-2.5 py-1 text-xs font-bold uppercase text-white shadow">
                Save {discount}%
              </span>
            ) : null}
          </div>

          {/* Content side */}
          <div className="flex flex-col justify-center gap-5 p-6 sm:p-10">
            {product.brand ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                {product.brand}
              </p>
            ) : null}

            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-foreground">
              {product.name}
            </h3>

            {topSpecs.length > 0 ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {topSpecs.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </dt>
                    <dd className="font-semibold text-foreground">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">{blurb}</p>
            )}

            {product.priceOnRequest ? (
              <p className="text-xl font-extrabold text-foreground">Contact for Price</p>
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-brand">
                  {formatPrice(product.salePriceCents ?? product.priceCents)}
                </span>
                {product.salePriceCents ? (
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.priceCents)}
                  </span>
                ) : null}
              </div>
            )}

            <p className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {product.stock > 0
                ? `In stock — Ships in 24hrs`
                : "Out of stock — enquire for availability"}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                View details <ArrowRight className="h-4 w-4" />
              </Link>
              {product.priceOnRequest ? (
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    `Enquiry: ${product.name} (SKU ${product.sku})`,
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-foreground hover:bg-brand/90"
                >
                  <Mail className="h-4 w-4" /> Enquire
                </a>
              ) : (
                <AddToCartButton product={product} variant="full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
