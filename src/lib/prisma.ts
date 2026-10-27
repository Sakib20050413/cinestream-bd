// Prisma Client Singleton for Supabase / PostgreSQL
let prismaInstance: any = null;

try {
  // Dynamic require ensures Next.js type check passes even before initial 'prisma generate' runs
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as {
    prisma: any;
  };

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch {
  // Fallback placeholder before database client generation
  prismaInstance = null;
}

export const prisma = prismaInstance;
export default prisma;
