import { addCollectionType, getCollectionTypes, CollectionType } from '@/lib/collections';
import { NextResponse } from 'next/server';

export async function GET() {
  const types = await getCollectionTypes();
  return NextResponse.json(types);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CollectionType;
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  await addCollectionType(body);
  return NextResponse.json(body, { status: 201 });
}
