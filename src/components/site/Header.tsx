import Link from "next/link";
import { FileText, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";
import { MAIN_NAV } from "@/lib/constants";

export function Header() {
  return (
    <header className="w-full border-b border-border bg-background">
      {/* Top row: logo, search, cart, wishlist, quotation CTA */}
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <Logo />
          <div className="lg:hidden">
            <CartButton />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <SearchBar />
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/quotation"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-foreground hover:bg-brand/90 transition-colors"
          >
            <FileText className="h-4 w-4" /> Quotation
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground hover:text-brand hover:border-brand transition-colors"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <CartButton />
        </div>
      </div>

      {/* Bottom row: main nav */}
      <nav className="hidden lg:block border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center gap-8 text-sm font-semibold uppercase tracking-wide">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-3 text-foreground/80 hover:text-brand transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
