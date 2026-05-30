import Link from "next/link";
import { prisma } from "@/lib/db";
import { SectionHeading } from "./SectionHeading";

const FALLBACK_MAKES = [
  "Honda",
  "Toyota",
  "Nissan",
  "Mazda",
  "Subaru",
  "Mitsubishi",
  "Lexus",
  "Acura",
  "Infiniti",
  "Ford",
  "Chevrolet",
  "BMW",
];

export async function ShopByMake() {
  let makes: { name: string; slug: string }[] = [];
  try {
    const rows = await prisma.vehicleMake.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      take: 12,
      select: { name: true, slug: true },
    });
    makes = rows;
  } catch (err) {
    console.error("[ShopByMake] DB lookup failed:", err);
  }

  // Empty DB fallback so the home page still has the section
  if (makes.length === 0) {
    makes = FALLBACK_MAKES.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionHeading>Shop by Make</SectionHeading>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {makes.map((m) => (
          <Link
            key={m.slug}
            href={`/shop?q=${encodeURIComponent(m.name)}`}
            className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card transition-all hover:border-brand/40 hover:shadow-sm"
          >
            <MakeInitials name={m.name} />
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground group-hover:text-brand">
              {m.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MakeInitials({ name }: { name: string }) {
  const initials = name
    .split(/[\s-]+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-base font-extrabold text-brand"
      aria-hidden
    >
      {initials}
    </span>
  );
}
