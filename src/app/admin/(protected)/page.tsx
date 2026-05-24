import Link from "next/link";
import {
  AlertTriangle,
  DollarSign,
  Globe,
  Package,
  ShoppingBag,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 10;

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOf7d = new Date(startOfToday);
  startOf7d.setDate(startOf7d.getDate() - 6);

  const [
    productCount,
    activeProductCount,
    featuredCount,
    hotDealCount,
    lowStockCount,
    categoryCount,
    orderCount,
    monthOrders,
    recentOrders,
    recentProducts,
    visitsToday,
    uniqueIpsToday,
    topCountries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.count({ where: { isHotDeal: true } }),
    prisma.product.count({ where: { stock: { lte: LOW_STOCK_THRESHOLD } } }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { createdAt: { gte: monthStart }, paymentStatus: "PAID" },
      _sum: { totalCents: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalCents: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        priceCents: true,
        stock: true,
        isActive: true,
        isFeatured: true,
        isHotDeal: true,
        createdAt: true,
      },
    }),
    prisma.visit.count({ where: { createdAt: { gte: startOfToday } } }),
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
      take: 5,
    }),
  ]);

  const monthRevenueCents = monthOrders._sum.totalCents ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Dashboard</h2>
          <p className="text-xs text-muted-foreground">
            Overview of products, orders, and revenue.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          + New product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Products"
          value={productCount}
          sub={`${activeProductCount} active`}
          href="/admin/products"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          label={`Low stock (≤${LOW_STOCK_THRESHOLD})`}
          value={lowStockCount}
          sub="Items needing reorder"
          href="/admin/products?lowStock=1"
        />
        <StatCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Orders"
          value={orderCount}
          sub="All time"
          href="/admin/orders"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          label="Revenue (MTD)"
          value={formatPrice(monthRevenueCents)}
          sub="Paid orders this month"
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5 text-brand" />}
          label="Featured"
          value={featuredCount}
          sub="Shown on home page"
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5 text-rose-500" />}
          label="Hot deals"
          value={hotDealCount}
          sub="Shown on home page"
        />
        <StatCard
          icon={<Tags className="h-5 w-5" />}
          label="Categories"
          value={categoryCount}
          href="/admin/categories"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Visitors today"
          value={visitsToday}
          sub={`${uniqueIpsToday.length} unique`}
          href="/admin/visitors"
        />
        <StatCard
          icon={<Globe className="h-5 w-5" />}
          label="Countries (7d)"
          value={topCountries.length}
          sub="See breakdown"
          href="/admin/visitors"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recent orders"
          empty={recentOrders.length === 0 ? "No orders yet." : null}
          link={{ href: "/admin/orders", label: "View all" }}
        >
          <ul className="divide-y divide-border">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.orderNumber}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.customerName} · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-muted-foreground">{o.status}</span>
                  <span className="font-semibold tabular-nums">{formatPrice(o.totalCents)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Recent products"
          empty={recentProducts.length === 0 ? "No products yet." : null}
          link={{ href: "/admin/products", label: "View all" }}
        >
          <ul className="divide-y divide-border">
            {recentProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Stock: {p.stock} ·{" "}
                    {[
                      p.isActive ? "active" : "inactive",
                      p.isFeatured ? "featured" : null,
                      p.isHotDeal ? "hot deal" : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="shrink-0 text-xs text-brand hover:underline"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-extrabold tabular-nums">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Panel({
  title,
  link,
  empty,
  children,
}: {
  title: string;
  link?: { href: string; label: string };
  empty?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        {link ? (
          <Link href={link.href} className="text-xs text-brand hover:underline">
            {link.label}
          </Link>
        ) : null}
      </div>
      {empty ? <p className="py-6 text-center text-xs text-muted-foreground">{empty}</p> : children}
    </div>
  );
}
