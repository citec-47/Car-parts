"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";

type Tab = "description" | "reviews";

export function ProductDetailTabs({
  description,
  rating,
  reviewCount,
}: {
  description: string;
  rating: number;
  reviewCount: number;
}) {
  const [tab, setTab] = useState<Tab>("description");

  return (
    <div className="mt-12">
      <div className="flex gap-6 border-b border-border text-sm font-semibold uppercase tracking-wide">
        <TabButton active={tab === "description"} onClick={() => setTab("description")}>
          Description
        </TabButton>
        <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
          Reviews ({reviewCount})
        </TabButton>
      </div>
      <div className="py-6">
        {tab === "description" ? (
          <div className="prose prose-sm max-w-none text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {description || "No description provided."}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <StarRating value={rating} count={reviewCount} />
              <span>
                {reviewCount === 0
                  ? "No reviews yet"
                  : `${reviewCount} review${reviewCount === 1 ? "" : "s"}`}
              </span>
            </div>
            <p className="mt-4">
              {reviewCount === 0
                ? "Be the first to share your experience with this product after purchasing."
                : "Customer reviews aren't surfaced here yet — coming soon."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 px-1 pb-3 transition-colors ${
        active
          ? "border-brand text-brand"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
