import Link from "next/link";

const BANNER_WHEELS =
  "https://images.unsplash.com/photo-1626668893632-6f3a4466d109?w=1200&h=400&fit=crop&auto=format";
const BANNER_JACKET =
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=400&fit=crop&auto=format";

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-10">
      <div className="grid gap-4 md:grid-cols-2">
        <PromoTile
          image={BANNER_WHEELS}
          title="BODY PARTS"
          subtitle="FOR ANY VEHICLE"
          accent="brand"
          tagline="An absolute for you"
          href="/categories/body-parts"
          align="left"
        />
        <PromoTile
          image={BANNER_JACKET}
          title="JACKET"
          subtitle="HARLEY DAVIDSON"
          accent="amber"
          tagline="Sale up to 45% off"
          href="/categories/accessories"
          align="right"
        />
      </div>
    </section>
  );
}

function PromoTile({
  image,
  title,
  subtitle,
  accent,
  tagline,
  href,
  align,
}: {
  image: string;
  title: string;
  subtitle: string;
  accent: "brand" | "amber";
  tagline: string;
  href: string;
  align: "left" | "right";
}) {
  const accentClass = accent === "brand" ? "text-brand" : "text-amber-400";
  return (
    <Link
      href={href}
      className="relative block overflow-hidden rounded-lg bg-zinc-900 h-[160px] group"
    >
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div
        className={`absolute inset-0 bg-gradient-to-${align === "left" ? "r" : "l"} from-black/85 via-black/40 to-transparent`}
      />
      <div
        className={`relative h-full flex flex-col justify-center p-6 text-white max-w-[60%] ${
          align === "right" ? "ml-auto items-end text-right" : ""
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{subtitle}</p>
        <h3 className={`text-2xl font-extrabold leading-tight ${accentClass}`}>{title}</h3>
        <p className="mt-1 text-xs text-white/70">{tagline}</p>
      </div>
    </Link>
  );
}
