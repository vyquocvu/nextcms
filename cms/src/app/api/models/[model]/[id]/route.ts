/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server';

async function getPrisma() {
  const mod = await import('@/lib/prisma');
  return mod.default;
}

function parseId(id: string) {
  const n = Number(id);
  return isNaN(n) ? id : n;
}

export async function GET(_req: NextRequest, context: unknown) {
  const prisma = await getPrisma();
  const params = (context as any).params as { model: string; id: string };
  const item = await (prisma as any)[params.model].findUnique({ where: { id: parseId(params.id) } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, context: unknown) {
  const prisma = await getPrisma();
  const params = (context as any).params as { model: string; id: string };
  const data = await req.json();
  const item = await (prisma as any)[params.model].update({ where: { id: parseId(params.id) }, data });
  return NextResponse.json(item);
}
