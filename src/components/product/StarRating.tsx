import { Star } from "lucide-react";

export function StarRating({ value, count }: { value: number; count?: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && hasHalf);
          return (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${filled ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {count !== undefined ? (
        <span className="text-[11px] text-muted-foreground">({count})</span>
      ) : null}
    </div>
  );
}
