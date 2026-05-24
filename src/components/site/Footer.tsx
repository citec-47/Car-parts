import Link from "next/link";
import { Logo } from "./Logo";
import { SITE, HEADER_CATEGORIES } from "@/lib/constants";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-topbar text-topbar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-background" />
          <p className="mt-4 text-sm leading-relaxed text-topbar-foreground/80 max-w-xs">
            {SITE.tagline} Free worldwide shipping on orders above $60.
          </p>
          <div className="mt-4 space-y-1.5 text-sm text-topbar-foreground/80">
            <p className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> {SITE.hotline}
            </p>
            <p className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> {SITE.email}
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-background">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {HEADER_CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="text-topbar-foreground/80 hover:text-brand transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-background">Help</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="text-topbar-foreground/80 hover:text-brand">
                All Products
              </Link>
            </li>
            <li>
              <span className="text-topbar-foreground/60">Shipping & Returns</span>
            </li>
            <li>
              <span className="text-topbar-foreground/60">Contact Us</span>
            </li>
            <li>
              <span className="text-topbar-foreground/60">FAQ</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-background">Newsletter</h4>
          <p className="mt-4 text-sm text-topbar-foreground/80">
            Drop your email for exclusive parts deals.
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-l-md bg-background/5 border border-border/40 px-3 py-2 text-sm text-background placeholder:text-topbar-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            <button
              type="submit"
              className="rounded-r-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/30">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-topbar-foreground/70 flex flex-col sm:flex-row justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Prices in USD. Free shipping over $60.</p>
        </div>
      </div>
    </footer>
  );
}
