"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "../product/ProductCard";
import { SectionHeading } from "./SectionHeading";
import { HEADER_CATEGORIES, FEATURED_TAB_SLUGS } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/category-icons";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const tabs = FEATURED_TAB_SLUGS.map(
    (slug) => HEADER_CATEGORIES.find((c) => c.slug === slug)!,
  );
  const [active, setActive] = useState<string>(tabs[0].slug);

  const visible = useMemo(() => {
    const filtered = products.filter((p) => p.categorySlug === active);
    return filtered.length ? filtered : products.slice(0, 4);
  }, [products, active]);

  return (
    <div className="flex-1">
      <SectionHeading align="center">Featured Products</SectionHeading>
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {tabs.map((t) => {
            const Icon = CATEGORY_ICONS[t.iconKey];
            const isActive = active === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => setActive(t.slug)}
                className={`group flex flex-col items-center gap-1 pb-2 transition-colors ${
                  isActive ? "text-brand" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-7 w-7" strokeWidth={1.75} />
                <span className="text-[11px] font-semibold uppercase tracking-wide">{t.name}</span>
                <span
                  className={`h-[2px] w-8 rounded-full ${
                    isActive ? "bg-brand" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} isNew={p.id === "p_6"} />
        ))}
      </div>
    </div>
  );
}
