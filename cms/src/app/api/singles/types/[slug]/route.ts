import { removeSingleType } from '@/lib/singles';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await removeSingleType(params.slug);
  return NextResponse.json({ ok: true });
}
