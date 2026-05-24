import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { prisma } from "@/lib/db";
import { logoutAdmin } from "../actions";
import { AdminSidebar } from "./AdminSidebar";

export const metadata = { title: "Admin" };

const ADMIN_COOKIE = "revparts_admin";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const expected = process.env.ADMIN_PASSWORD ?? "admin";
  const isAuthed = c.get(ADMIN_COOKIE)?.value === expected;
  if (!isAuthed) redirect("/admin/login");

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar categories={categories} />

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between border-b border-border px-4 py-3">
          <Link href="/admin" className="font-extrabold">
            RevParts Admin
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              aria-label="Sign out"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
          <span className="sr-only">
            <Menu className="h-4 w-4" />
          </span>
        </header>

        <main className="px-6 py-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
