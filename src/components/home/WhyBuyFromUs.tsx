import { ShieldCheck, Truck, Wrench, BadgeCheck } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Compression-Tested",
    body: "Every engine compression-tested and inspected before shipping.",
  },
  {
    icon: Wrench,
    title: "Low-Mileage Guarantee",
    body: "Verified low-mileage JDM imports — odometer evidence on request.",
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    body: "Crated, insured, and tracked door-to-door to most countries.",
  },
  {
    icon: BadgeCheck,
    title: "30-Day Warranty",
    body: "Standard mechanical warranty against major internal failure.",
  },
];

export function WhyBuyFromUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-10">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
