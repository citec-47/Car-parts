import { Search } from "lucide-react";
import { HEADER_CATEGORIES } from "@/lib/constants";

export function SearchBar() {
  return (
    <form
      action="/shop"
      method="get"
      className="flex w-full max-w-2xl items-stretch rounded-md border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand/40"
      role="search"
    >
      <select
        name="category"
        defaultValue=""
        aria-label="Category"
        className="hidden sm:block bg-muted text-sm px-3 border-r border-border focus:outline-none cursor-pointer"
      >
        <option value="">All Categories</option>
        {HEADER_CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        name="q"
        type="search"
        placeholder="Enter keyword…"
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
