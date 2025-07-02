import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const files = await prisma.media.findMany();
  return NextResponse.json(files.map((f) => ({ id: f.id, name: f.name, url: f.url })));
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data || !data.name || !data.url) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const created = await prisma.media.create({ data: { name: data.name, url: data.url } });
  return NextResponse.json({ id: created.id, name: created.name, url: created.url }, { status: 201 });
}
