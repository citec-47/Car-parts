import Link from "next/link";
import { Heart } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { CartButton } from "./CartButton";
import { MAIN_NAV } from "@/lib/constants";

export function Header() {
  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <Logo />
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold uppercase tracking-wide">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-brand transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="lg:hidden">
            <CartButton />
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <SearchBar />
        </div>
        <div className="hidden lg:flex items-center gap-2">
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
    </header>
  );
}
