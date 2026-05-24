"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, calculateShipping } from "@/lib/format";
import { SHIPPING } from "@/lib/constants";
import { QuantityPicker } from "@/components/product/QuantityPicker";

export default function CartPage() {
  const { cart, subtotalCents, removeItem, updateQuantity, isHydrated } = useCart();
  const shipping = calculateShipping(
    subtotalCents,
    SHIPPING.freeShippingThresholdCents,
    SHIPPING.flatRateCents,
  );
  const total = subtotalCents + shipping;

  if (isHydrated && cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the catalog and add some parts.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          Shop now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-foreground">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-border bg-card">
          <ul className="divide-y divide-border">
            {cart.items.map((item) => (
              <li key={item.productId} className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-semibold hover:text-brand line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <QuantityPicker
                      initial={item.quantity}
                      onChange={(q) => updateQuantity(item.productId, q)}
                    />
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.unitPriceCents)} each
                      </p>
                      <p className="text-base font-bold text-brand">
                        {formatPrice(item.unitPriceCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 h-fit">
          <h2 className="text-base font-bold uppercase tracking-wide">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-emerald-600">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </dd>
            </div>
            {shipping > 0 ? (
              <p className="text-xs text-muted-foreground">
                Add{" "}
                {formatPrice(SHIPPING.freeShippingThresholdCents - subtotalCents)}{" "}
                more for free shipping.
              </p>
            ) : null}
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-extrabold text-brand">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand/90 transition-colors"
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop"
            className="mt-2 inline-flex w-full items-center justify-center text-xs text-muted-foreground hover:text-brand"
          >
            or continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
