"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export function CartButton() {
  const { itemCount, subtotalCents, isHydrated } = useCart();

  return (
    <Link
      href="/cart"
      className="group flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition-colors"
      aria-label={`Cart with ${itemCount} items`}
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
        <ShoppingCart className="h-5 w-5" />
        {isHydrated && itemCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold leading-none text-brand-foreground">
            {itemCount}
          </span>
        ) : null}
      </span>
      <div className="hidden lg:flex flex-col leading-tight">
        <span className="text-xs text-muted-foreground">My Cart</span>
        <span className="text-sm font-semibold text-brand">
          {isHydrated ? formatPrice(subtotalCents) : "$0.00"}
        </span>
      </div>
    </Link>
  );
}
