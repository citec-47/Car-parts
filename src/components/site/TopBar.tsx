import Link from "next/link";
import { ChevronDown, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";
import { getVisitorGeo } from "@/lib/visitor";

function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "";
  const cc = code.toUpperCase();
  return String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0)));
}

function countryName(code: string | null): string {
  if (!code) return "Unknown location";
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code
    );
  } catch {
    return code;
  }
}

export async function TopBar() {
  const geo = await getVisitorGeo();
  const flag = countryFlag(geo.countryCode);
  const label = countryName(geo.countryCode);
  const detail = [geo.city, geo.region].filter(Boolean).join(", ");

  return (
    <div className="w-full bg-topbar text-topbar-foreground text-xs">
      <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            Hotline {SITE.hotline}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-white/80">
            <MapPin className="h-3.5 w-3.5" />
            {flag ? <span aria-hidden>{flag}</span> : null}
            <span>
              {label}
              {detail ? <span className="text-white/60"> · {detail}</span> : null}
            </span>
          </span>
        </div>
        <div className="flex items-center divide-x divide-white/15">
          <Link
            href="/admin/login"
            className="px-3 hover:text-white transition-colors"
          >
            Login / Register
          </Link>
          <TopBarSelect label="EN" options={["EN", "FR", "DE", "ES"]} />
          <TopBarSelect label="USD" options={["USD", "EUR", "GBP", "JPY"]} />
        </div>
      </div>
    </div>
  );
}

function TopBarSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="relative inline-flex items-center px-3 hover:text-white transition-colors cursor-pointer">
      <span className="font-semibold tracking-wide">{label}</span>
      <ChevronDown className="ml-1 h-3 w-3 opacity-70" />
      <select
        defaultValue={label}
        aria-label={label}
        className="absolute inset-0 opacity-0 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="text-foreground">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
