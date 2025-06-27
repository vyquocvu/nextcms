import { removeCollectionType, getCollectionType } from '@/lib/collections';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const type = await getCollectionType(params.slug);
  if (!type) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(type);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await removeCollectionType(params.slug);
  return NextResponse.json({ ok: true });
}
