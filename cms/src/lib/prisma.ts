/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
let prisma: unknown;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (err) {
  console.warn('PrismaClient not initialized', err);
  prisma = {};
}

export default prisma as any;
