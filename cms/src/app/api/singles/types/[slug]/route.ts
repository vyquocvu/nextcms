import { removeSingleType } from '@/lib/singles';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const params = await context.params;
  await removeSingleType(params.slug);
  return NextResponse.json({ ok: true });
}
