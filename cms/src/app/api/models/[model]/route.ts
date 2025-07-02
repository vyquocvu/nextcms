/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server';

async function getPrisma() {
  const mod = await import('@/lib/prisma');
  return mod.default;
}

export async function GET(_req: NextRequest, context: unknown) {
  const prisma = await getPrisma();
  const params = (context as any).params as { model: string };
  const items = await (prisma as any)[params.model].findMany();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest, context: unknown) {
  const prisma = await getPrisma();
  const params = (context as any).params as { model: string };
  const data = await req.json();
  const item = await (prisma as any)[params.model].create({ data });
  return NextResponse.json(item, { status: 201 });
}
