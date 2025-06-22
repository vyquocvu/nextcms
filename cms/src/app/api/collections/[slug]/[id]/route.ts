import { updateEntry } from '@/lib/collections';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  const body = await request.json();
  const entry = await updateEntry(params.slug, params.id, body);
  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(entry);
}
