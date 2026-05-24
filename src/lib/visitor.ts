import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "./db";

const SKIP_PATH_PREFIXES = ["/admin", "/api", "/_next"];
const HASH_SALT = process.env.VISITOR_HASH_SALT ?? "revparts-default-salt";

export type VisitorGeo = {
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
};

function shouldTrackPath(pathname: string): boolean {
  if (!pathname) return false;
  return !SKIP_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function hashIp(ip: string): string {
  return createHash("sha256").update(HASH_SALT + ip).digest("hex").slice(0, 32);
}

function decodeHeader(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getVisitorGeo(): Promise<VisitorGeo> {
  const h = await headers();
  return {
    countryCode: h.get("x-vercel-ip-country") ?? null,
    country: decodeHeader(h.get("x-vercel-ip-country")),
    region: decodeHeader(h.get("x-vercel-ip-country-region")),
    city: decodeHeader(h.get("x-vercel-ip-city")),
  };
}

export type VisitSnapshot = {
  pathname: string;
  userAgent: string | null;
  forwardedFor: string;
  realIp: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  referer: string | null;
};

// Capture a snapshot of the request — call this from the server component synchronously,
// then pass into trackVisit() inside an after() callback.
export async function captureVisitSnapshot(): Promise<VisitSnapshot> {
  const h = await headers();
  return {
    pathname: h.get("x-pathname") ?? "",
    userAgent: h.get("user-agent"),
    forwardedFor: h.get("x-forwarded-for") ?? "",
    realIp: h.get("x-real-ip"),
    countryCode: h.get("x-vercel-ip-country"),
    region: decodeHeader(h.get("x-vercel-ip-country-region")),
    city: decodeHeader(h.get("x-vercel-ip-city")),
    referer: h.get("referer"),
  };
}

// Fire-and-forget. Never throws. Skips admin/internal paths.
export async function trackVisit(snapshot: VisitSnapshot): Promise<void> {
  try {
    if (!shouldTrackPath(snapshot.pathname)) return;
    if (snapshot.userAgent && /bot|crawler|spider|preview|monitor/i.test(snapshot.userAgent)) return;

    const ip =
      snapshot.forwardedFor.split(",")[0]?.trim() || snapshot.realIp || "0.0.0.0";

    await prisma.visit.create({
      data: {
        ipHash: hashIp(ip),
        country: snapshot.countryCode ?? null,
        countryCode: snapshot.countryCode ?? null,
        region: snapshot.region,
        city: snapshot.city,
        path: snapshot.pathname,
        userAgent: snapshot.userAgent?.slice(0, 500) ?? null,
        referer: snapshot.referer?.slice(0, 500) ?? null,
      },
    });
  } catch (err) {
    console.error("[trackVisit] failed:", err);
  }
}
