"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): TimeLeft {
  const total = Math.max(0, target - Date.now());
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const target = endsAt.getTime();
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setLeft(diff(target));
    const id = window.setInterval(() => setLeft(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const cells = [
    { label: "Days", value: left?.days },
    { label: "Hrs", value: left?.hours },
    { label: "Mins", value: left?.minutes },
    { label: "Secs", value: left?.seconds },
  ];

  return (
    <div className="inline-flex items-center gap-2">
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex flex-col items-center justify-center rounded-md bg-black/80 text-white px-2.5 py-1.5 min-w-[44px]"
        >
          <span className="text-sm font-bold leading-none tabular-nums">
            {c.value !== undefined ? String(c.value).padStart(2, "0") : "--"}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-white/70 mt-0.5">
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}
