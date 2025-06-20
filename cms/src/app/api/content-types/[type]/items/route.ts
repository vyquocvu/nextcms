import { addItem, getItems } from '@/lib/contentTypes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: unknown
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = await (context as any).params;
  const type = params?.type as string;
  const items = await getItems(type);
  return NextResponse.json(items);
}

export async function POST(
  request: NextRequest,
  context: unknown
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = await (context as any).params;
  const type = params?.type as string;
  const body = await request.json();
  const item = await addItem(type, body);
  return NextResponse.json(item, { status: 201 });
}
