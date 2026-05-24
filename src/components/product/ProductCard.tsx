import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, calculateDiscountPercent } from "@/lib/format";
import { StarRating } from "./StarRating";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product, isNew = false }: { product: Product; isNew?: boolean }) {
  const img = product.images[0];
  const discount = product.salePriceCents
    ? calculateDiscountPercent(product.priceCents, product.salePriceCents)
    : 0;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-card">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {img ? (
            <Image
              src={img.url}
              alt={img.altText ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 ? (
            <span className="inline-flex items-center rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-bold text-brand-foreground uppercase">
              -{discount}%
            </span>
          ) : null}
          {isNew ? (
            <span className="inline-flex items-center rounded-sm bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
              New
            </span>
          ) : null}
        </div>
        <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <AddToCartButton product={product} />
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-foreground line-clamp-2 hover:text-brand transition-colors"
        >
          {product.name}
        </Link>
        <StarRating value={product.rating} count={product.reviewCount} />
        <div className="mt-1 flex items-baseline gap-2">
          {product.salePriceCents ? (
            <>
              <span className="text-base font-bold text-brand">
                {formatPrice(product.salePriceCents)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.priceCents)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-brand">{formatPrice(product.priceCents)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
