import { Globe, Users } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🏳️";
  const cc = code.toUpperCase();
  return String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0)));
}

function countryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code
    );
  } catch {
    return code;
  }
}

export default async function AdminVisitorsPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOf7d = new Date(startOfToday);
  startOf7d.setDate(startOf7d.getDate() - 6);
  const startOf30d = new Date(startOfToday);
  startOf30d.setDate(startOf30d.getDate() - 29);

  const [
    today,
    last7d,
    last30d,
    uniqueIpsToday,
    countryBreakdown,
    recentVisits,
    topPaths,
  ] = await Promise.all([
    prisma.visit.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.visit.count({ where: { createdAt: { gte: startOf7d } } }),
    prisma.visit.count({ where: { createdAt: { gte: startOf30d } } }),
    prisma.visit.findMany({
      where: { createdAt: { gte: startOfToday } },
      distinct: ["ipHash"],
      select: { ipHash: true },
    }),
    prisma.visit.groupBy({
      by: ["countryCode"],
      where: { createdAt: { gte: startOf7d } },
      _count: { _all: true },
      orderBy: { _count: { countryCode: "desc" } },
      take: 30,
    }),
    prisma.visit.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        createdAt: true,
        countryCode: true,
        city: true,
        region: true,
        path: true,
        referer: true,
      },
    }),
    prisma.visit.groupBy({
      by: ["path"],
      where: { createdAt: { gte: startOf7d } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
  ]);

  const breakdownTotal = countryBreakdown.reduce((s, c) => s + c._count._all, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold">Visitors</h2>
        <p className="text-xs text-muted-foreground">
          Where your visitors are browsing from. Geo data comes from edge headers — in local dev
          country shows as <em>Unknown</em>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="Today" value={today} />
        <Stat icon={<Users className="h-5 w-5" />} label="Unique today" value={uniqueIpsToday.length} />
        <Stat icon={<Users className="h-5 w-5" />} label="Last 7 days" value={last7d} />
        <Stat icon={<Users className="h-5 w-5" />} label="Last 30 days" value={last30d} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-semibold">Countries · last 7 days</h3>
            <p className="text-xs text-muted-foreground">{breakdownTotal} visits across {countryBreakdown.length} countries</p>
          </div>
          {countryBreakdown.length === 0 ? (
            <p className="p-8 text-center text-xs text-muted-foreground">No data yet — visit a public page to record a visit.</p>
          ) : (
            <ul className="divide-y divide-border">
              {countryBreakdown.map((row) => {
                const count = row._count._all;
                const pct = breakdownTotal > 0 ? (count / breakdownTotal) * 100 : 0;
                return (
                  <li key={row.countryCode ?? "unknown"} className="px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-base" aria-hidden>
                          {countryFlag(row.countryCode)}
                        </span>
                        <span className="font-medium">{countryName(row.countryCode)}</span>
                        {row.countryCode ? (
                          <span className="text-xs text-muted-foreground">({row.countryCode})</span>
                        ) : null}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {count} · {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-semibold">Top pages · last 7 days</h3>
          </div>
          {topPaths.length === 0 ? (
            <p className="p-8 text-center text-xs text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {topPaths.map((row) => (
                <li key={row.path} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
                  <span className="truncate text-muted-foreground">{row.path}</span>
                  <span className="shrink-0 tabular-nums font-semibold">{row._count._all}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4 flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Recent visits</h3>
        </div>
        {recentVisits.length === 0 ? (
          <p className="p-8 text-center text-xs text-muted-foreground">No visits yet.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {recentVisits.map((v) => (
              <li key={v.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5">
                <span aria-hidden>{countryFlag(v.countryCode)}</span>
                <span className="min-w-0">
                  <span className="font-medium">
                    {countryName(v.countryCode)}
                    {v.city ? <span className="text-muted-foreground"> · {v.city}</span> : null}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{v.path}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {new Date(v.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}
