import Link from "next/link";
import { Gauge } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-extrabold tracking-tight text-xl ${className}`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-sm">
        <Gauge className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="text-foreground">
        Rev<span className="text-brand">Parts</span>
      </span>
    </Link>
  );
}
