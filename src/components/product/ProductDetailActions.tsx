"use client";

import { useState } from "react";
import { QuantityPicker } from "./QuantityPicker";
import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/lib/types";

export function ProductDetailActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityPicker initial={1} onChange={setQty} max={Math.max(1, product.stock)} />
      <AddToCartButton product={product} quantity={qty} variant="full" />
    </div>
  );
}
