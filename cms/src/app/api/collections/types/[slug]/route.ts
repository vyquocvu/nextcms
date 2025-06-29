import { removeCollectionType, getCollectionType } from '@/lib/collections';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  const type = await getCollectionType(params.slug);
  if (!type) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(type);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  await removeCollectionType(params.slug);
  return NextResponse.json({ ok: true });
}
