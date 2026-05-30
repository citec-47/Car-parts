import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <form
      action="/shop"
      method="get"
      className="flex w-full max-w-2xl items-stretch rounded-md border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand/40"
      role="search"
    >
      <input
        name="q"
        type="search"
        placeholder="Search products…"
        className="flex-1 px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground focus:outline-none min-w-0"
      />
      <button
        type="submit"
        className="bg-brand text-brand-foreground px-5 hover:bg-brand/90 transition-colors flex items-center justify-center"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
