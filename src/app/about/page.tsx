import Link from "next/link";
import { ArrowRight, ShieldCheck, Wrench, Globe, BadgeCheck } from "lucide-react";

export const metadata = { title: "About us" };

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Compression-Tested",
    body: "Every engine is compression-tested before it ever leaves our warehouse. No surprises after delivery.",
  },
  {
    icon: Wrench,
    title: "Low-Mileage, Verified",
    body: "Our buyers in Japan source from end-of-life vehicles with documented low miles. Odometer evidence available on request.",
  },
  {
    icon: Globe,
    title: "Shipped Worldwide",
    body: "Crated, insured, and tracked. We ship to most countries via established freight partners.",
  },
  {
    icon: BadgeCheck,
    title: "30-Day Warranty",
    body: "Mechanical warranty against major internal failure on every engine, no fine-print games.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">About Us</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold text-foreground">
          JDM engines, sourced and shipped with care.
        </h1>
        <p className="mt-5 mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
          We import authentic Japanese Domestic Market engines, transmissions,
          and drivetrains directly from Japan — then test, document, and ship
          each unit so it&apos;s ready to install when it arrives at your shop.
        </p>
      </header>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <article
              key={p.title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-foreground">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-16 rounded-lg bg-zinc-950 p-10 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Looking for a specific engine?
        </h2>
        <p className="mt-3 text-sm text-white/70">
          Tell us what vehicle you&apos;re building and we&apos;ll match it from our
          warehouse — or source it on your behalf from Japan.
        </p>
        <Link
          href="/quotation"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-brand/90"
        >
          Request a Quotation <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
