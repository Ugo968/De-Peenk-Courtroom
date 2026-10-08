/**
 * Prisma Client Singleton
 * 
 * In production (Next.js), this prevents creating multiple instances
 * of PrismaClient during hot-reloading in development.
 * 
 * Usage:
 *   import { prisma } from '@/lib/prisma'
 *   const users = await prisma.user.findMany()
 */

// This file serves as a reference for the Next.js implementation.
// In a Vite/React environment, we can't use Prisma directly (it's server-side only).

export const PRISMA_CLIENT_CODE = `
// src/lib/prisma.ts (for Next.js production)

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
`;

// Mock prisma for client-side demo purposes
export const prisma = null; // Would be PrismaClient in server environment
