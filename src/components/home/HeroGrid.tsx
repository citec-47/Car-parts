import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PROMO_IMG_LARGE =
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&h=900&fit=crop&auto=format";
const PROMO_IMG_SPORTS =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop&auto=format";
const PROMO_IMG_INTERIOR =
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop&auto=format";
const PROMO_IMG_FERRARI =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop&auto=format";

export function HeroGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-3 lg:h-[540px]">
        {/* Big hero left, spans 3 rows + 2 cols on lg */}
        <div className="relative overflow-hidden rounded-lg bg-zinc-900 lg:col-span-2 lg:row-span-3 min-h-[280px]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: `url(${PROMO_IMG_LARGE})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="relative h-full flex flex-col justify-center p-8 sm:p-12 text-white max-w-md">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">
              New Arrival 2026
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight">
              Exciting bundle <br />
              <span className="text-brand">Get 30% off</span>
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Mix-and-match wheel, tire, and brake kits — discount applies automatically at checkout.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 self-start rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90 transition-colors"
            >
              Shop now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="absolute bottom-5 left-8 flex items-center gap-1.5" aria-hidden>
            <span className="h-1.5 w-5 rounded-full bg-brand" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Right column: 3 stacked tiles */}
        <div className="relative overflow-hidden rounded-lg bg-zinc-900 min-h-[170px]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url(${PROMO_IMG_SPORTS})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <div className="relative h-full flex flex-col justify-center p-5 text-white">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand">
              Mega Sale
            </span>
            <h3 className="mt-1 text-xl font-extrabold text-brand leading-none">30% OFF</h3>
            <p className="mt-1 text-[11px] text-white/80 max-w-[180px]">
              For all wheels, tire chains & accessories
            </p>
            <Link
              href="/categories/wheels-tires"
              className="mt-2 inline-flex items-center gap-1.5 self-start rounded-sm bg-brand px-2.5 py-1 text-[10px] font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Shop now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-zinc-900 min-h-[170px]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url(${PROMO_IMG_INTERIOR})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
          <div className="relative h-full flex flex-col justify-center items-end p-5 text-right text-white">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
              Merry Xmas — Big Sale
            </span>
            <h3 className="mt-1 text-lg font-extrabold leading-tight">
              Interior Auto <br /> Redesign
            </h3>
            <Link
              href="/categories/accessories"
              className="mt-2 inline-flex items-center gap-1.5 self-end rounded-sm border border-white/40 px-2.5 py-1 text-[10px] font-semibold hover:bg-white/10"
            >
              Shop now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-zinc-900 min-h-[170px]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
            style={{ backgroundImage: `url(${PROMO_IMG_FERRARI})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent" />
          <div className="relative h-full flex flex-col justify-center items-end p-5 text-right text-white">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
              Clearance Sale up 50%
            </span>
            <h3 className="mt-1 text-lg font-extrabold leading-tight text-brand">
              Ferrari Brand <br /> Auto Parts
            </h3>
            <Link
              href="/categories/performance"
              className="mt-2 inline-flex items-center gap-1.5 self-end rounded-sm bg-brand px-2.5 py-1 text-[10px] font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Shop now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
