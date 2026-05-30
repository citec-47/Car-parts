import type { Product } from "@/lib/types";
import { ProductCard } from "../product/ProductCard";
import { SectionHeading } from "./SectionHeading";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex-1">
        <SectionHeading align="center">Featured Products</SectionHeading>
        <div className="rounded-md border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No featured products yet.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <SectionHeading align="center">Featured Products</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
