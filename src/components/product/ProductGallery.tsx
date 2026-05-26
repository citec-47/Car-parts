"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  name,
  discount,
}: {
  images: ProductImage[];
  name: string;
  discount?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted" />
    );
  }

  const active = images[Math.min(activeIndex, images.length - 1)];
  const hasMultiple = images.length > 1;

  return (
    <div className="flex gap-3">
      {hasMultiple ? (
        <div className="flex shrink-0 flex-col gap-2 w-16 sm:w-20">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                i === activeIndex
                  ? "border-brand"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="group relative flex-1 aspect-square overflow-hidden rounded-lg border border-border bg-card">
        <Image
          key={active.id}
          src={active.url}
          alt={active.altText ?? name}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          priority
        />
        {discount && discount > 0 ? (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-sm bg-brand px-2.5 py-1 text-xs font-bold uppercase text-brand-foreground">
            -{discount}%
          </span>
        ) : null}
      </div>
    </div>
  );
}
