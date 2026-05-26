import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    // Neon's free tier suspends idle compute. If we hold connections too long
    // they go stale and the next query errors with "Server has closed the
    // connection." Recycling at 10s keeps the pool fresh.
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 30_000,
    max: 5,
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
