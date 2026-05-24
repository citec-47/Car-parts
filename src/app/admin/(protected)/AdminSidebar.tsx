"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Tags,
} from "lucide-react";
import { logoutAdmin } from "../actions";

type Category = { id: string; name: string; slug: string };

export function AdminSidebar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-border">
        <Link href="/admin" className="block">
          <p className="text-base font-extrabold tracking-tight">RevParts</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Admin</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
        <SidebarLink
          href="/admin"
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="Dashboard"
          active={isActive("/admin") && !pathname.startsWith("/admin/")}
        />
        <SidebarLink
          href="/admin/products"
          icon={<Package className="h-4 w-4" />}
          label="Products"
          active={pathname === "/admin/products" && !activeCategory}
        />

        <div className="mt-1">
          <button
            type="button"
            onClick={() => setCategoriesOpen((v) => !v)}
            className={`group flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-muted ${
              pathname.startsWith("/admin/categories") ? "bg-muted font-semibold" : ""
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Tags className="h-4 w-4" /> Categories
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                categoriesOpen ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>
          {categoriesOpen ? (
            <ul className="mt-1 ml-3 border-l border-border pl-2">
              <li>
                <Link
                  href="/admin/categories"
                  className={`block rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground ${
                    pathname === "/admin/categories" ? "bg-muted text-foreground" : ""
                  }`}
                >
                  All categories
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/products?category=${c.slug}`}
                    className={`block rounded-md px-2 py-1.5 text-xs hover:bg-muted ${
                      activeCategory === c.slug
                        ? "bg-brand/10 text-brand font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <SidebarLink
          href="/admin/orders"
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Orders"
          active={isActive("/admin/orders")}
        />
        <SidebarLink
          href="/admin/visitors"
          icon={<Globe className="h-4 w-4" />}
          label="Visitors"
          active={isActive("/admin/visitors")}
        />
      </nav>

      <div className="border-t border-border px-3 py-3">
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-2 ${
        active ? "bg-brand/10 text-brand font-semibold" : "hover:bg-muted"
      }`}
    >
      {icon} {label}
    </Link>
  );
}
