"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

type Variant = "icon" | "full";

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "icon",
  className = "",
}: {
  product: Pick<Product, "id" | "slug" | "name" | "sku" | "priceCents" | "salePriceCents" | "images">;
  quantity?: number;
  variant?: Variant;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const onClick = () => {
    const unitPriceCents = product.salePriceCents ?? product.priceCents;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        image: product.images[0]?.url ?? null,
        unitPriceCents,
      },
      quantity,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Add ${product.name} to cart`}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:border-brand hover:text-brand transition-colors ${className}`}
      >
        {added ? <Check className="h-4 w-4 text-brand" /> : <ShoppingCart className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90 transition-colors ${className}`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added to cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> Add to cart
        </>
      )}
    </button>
  );
}
