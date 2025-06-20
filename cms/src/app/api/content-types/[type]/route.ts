import { getContentTypes } from '@/lib/contentTypes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: unknown
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = await (context as any).params;
  const types = await getContentTypes();
  const type = types.find((t) => t.name === (params?.type as string));
  if (!type) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(type);
}
