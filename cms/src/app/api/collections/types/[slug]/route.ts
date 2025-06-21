import { removeCollectionType } from '@/lib/collections';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function DELETE(_req: NextRequest, context: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = (context as any).params as { slug: string };
  await removeCollectionType(params.slug);
  return NextResponse.json({ ok: true });
}
