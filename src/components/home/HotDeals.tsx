import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, calculateDiscountPercent } from "@/lib/format";
import { StarRating } from "../product/StarRating";
import { AddToCartButton } from "../product/AddToCartButton";
import { SectionHeading } from "./SectionHeading";
import { CountdownTimer } from "./CountdownTimer";

export function HotDeals({ products }: { products: Product[] }) {
  const product = products[0];
  if (!product) return null;
  const img = product.images[0];
  const discount = product.salePriceCents
    ? calculateDiscountPercent(product.priceCents, product.salePriceCents)
    : 0;
  return (
    <div>
      <SectionHeading
        right={
          <>
            <button
              aria-label="Previous"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-brand hover:border-brand transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-brand hover:border-brand transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        }
      >
        Hot Deals
      </SectionHeading>
      <article className="flex flex-col">
        <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-card">
          <Link href={`/products/${product.slug}`}>
            {img ? (
              <Image
                src={img.url}
                alt={img.altText ?? product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </Link>
          {discount > 0 ? (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-sm bg-brand px-2 py-1 text-[10px] font-bold text-brand-foreground uppercase">
              SALE
            </span>
          ) : (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-sm bg-brand px-2 py-1 text-[10px] font-bold text-brand-foreground uppercase">
              SALE
            </span>
          )}
          {product.hotDealEndsAt ? (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <CountdownTimer endsAt={product.hotDealEndsAt} />
            </div>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-foreground line-clamp-2 hover:text-brand"
          >
            {product.name}
          </Link>
          <StarRating value={product.rating} count={product.reviewCount} />
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-brand">
                {formatPrice(product.salePriceCents ?? product.priceCents)}
              </span>
              {product.salePriceCents ? (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.priceCents)}
                </span>
              ) : null}
            </div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </article>
    </div>
  );
}
