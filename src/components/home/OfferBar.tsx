import Link from "next/link";

const BG =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=300&fit=crop&auto=format";

export function OfferBar() {
  return (
    <section className="mt-12">
      <div className="relative overflow-hidden bg-zinc-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${BG})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
        <div className="relative mx-auto max-w-7xl px-4 py-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm text-white">
          <span className="font-semibold">Today Offer:</span>
          <span className="text-white/80">
            $20 OFF orders $300 or more with code{" "}
            <span className="font-extrabold text-brand">REV20</span> + Free shipping on orders over
            $60
          </span>
          <Link
            href="/shop"
            className="text-xs font-semibold text-brand hover:underline underline-offset-4"
          >
            Offer Details
          </Link>
        </div>
      </div>
    </section>
  );
}
