import { Truck, RefreshCw, Headphones, ShieldCheck } from "lucide-react";
import { TRUST_BADGES } from "@/lib/constants";

const ICONS = [Truck, RefreshCw, Headphones, ShieldCheck];

export function TrustBadges() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_BADGES.map((b, i) => {
          const Icon = ICONS[i];
          return (
            <div key={b.title} className="flex items-start gap-4">
              <div className="relative shrink-0">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-brand/20 bg-brand/5 text-brand">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-brand-foreground shadow-sm">
                  0{i + 1}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-foreground">
                  {b.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-[220px]">
                  {b.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
