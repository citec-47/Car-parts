import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

const HERO_BG =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2000&h=1200&fit=crop&auto=format&q=80";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        {/* Vignette + bottom fade for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.85) 100%)",
          }}
          aria-hidden
        />
        {/* Subtle red accent gradient */}
        <div
          className="absolute -left-40 top-0 h-full w-1/2 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(220,38,38,0.5) 0%, transparent 60%)",
          }}
          aria-hidden
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Direct from Japan
          </p>

          {/* Headline */}
          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            Authentic JDM Engines.{" "}
            <span className="text-brand">Imported, Tested,</span>{" "}
            <span className="text-white/90">Shipped Worldwide.</span>
          </h1>

          {/* Sub */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/70">
            Hand-picked, low-mileage engines and drivetrains. Every unit
            compression-tested and inspected before it leaves our warehouse —
            backed by a 30-day mechanical warranty.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground transition-all hover:bg-brand/90 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse Engines
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/quotation"
              className="group inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <FileText className="h-4 w-4" />
              Request a Quote
            </Link>
          </div>

          {/* Quick badges */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
            <Badge>30-Day Warranty</Badge>
            <Badge>Compression-Tested</Badge>
            <Badge>Worldwide Shipping</Badge>
            <Badge>Low-Mileage Verified</Badge>
          </div>
        </div>
      </div>

      {/* Decorative bottom rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(220,38,38,0.6) 50%, transparent 100%)",
        }}
        aria-hidden
      />
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-1 w-1 rounded-full bg-brand" />
      {children}
    </span>
  );
}
