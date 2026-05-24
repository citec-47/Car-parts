"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function QuantityPicker({
  initial = 1,
  min = 1,
  max = 99,
  onChange,
}: {
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (q: number) => void;
}) {
  const [q, setQ] = useState(initial);
  const update = (next: number) => {
    const clamped = Math.max(min, Math.min(max, next));
    setQ(clamped);
    onChange?.(clamped);
  };
  return (
    <div className="inline-flex items-center rounded-md border border-border">
      <button
        type="button"
        onClick={() => update(q - 1)}
        className="inline-flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted disabled:opacity-50"
        disabled={q <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={q}
        min={min}
        max={max}
        onChange={(e) => update(Number(e.target.value) || min)}
        className="h-10 w-12 border-x border-border bg-background text-center text-sm font-semibold tabular-nums focus:outline-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => update(q + 1)}
        className="inline-flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted disabled:opacity-50"
        disabled={q >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
