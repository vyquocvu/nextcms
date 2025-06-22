import { getSingleEntry, updateSingleEntry } from '@/lib/singles';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, context: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = await (context as any).params;
  const slug = params?.slug as string;
  const entry = await getSingleEntry(slug);
  return NextResponse.json(entry);
}

export async function PUT(request: NextRequest, context: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = await (context as any).params;
  const slug = params?.slug as string;
  const body = await request.json();
  const updated = await updateSingleEntry(slug, body);
  return NextResponse.json(updated);
}
