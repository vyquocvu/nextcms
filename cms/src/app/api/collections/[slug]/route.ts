import { addEntry, getEntries } from '@/lib/collections';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: unknown
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { params } = await (context as any);
  const entries = await getEntries(params.slug);
  return NextResponse.json(entries);
}

export async function POST(
  request: NextRequest,
  context: unknown
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { params } = await (context as any);
  const body = await request.json();
  const entry = await addEntry(params.slug, body);
  return NextResponse.json(entry, { status: 201 });
}
