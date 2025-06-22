import { removeCollectionType } from '@/lib/collections';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await removeCollectionType(params.slug);
  return NextResponse.json({ ok: true });
}
