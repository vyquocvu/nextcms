import { getSingleTypes, addSingleType, SingleType } from '@/lib/singles';
import { NextResponse } from 'next/server';

export async function GET() {
  const types = await getSingleTypes();
  return NextResponse.json(types);
}

export async function POST(request: Request) {
  const body = (await request.json()) as SingleType;
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  await addSingleType(body);
  return NextResponse.json(body, { status: 201 });
}
