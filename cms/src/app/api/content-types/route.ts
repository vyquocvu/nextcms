import { addContentType, getContentTypes } from '@/lib/contentTypes';
import { NextResponse } from 'next/server';

export async function GET() {
  const types = await getContentTypes();
  return NextResponse.json(types);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !Array.isArray(body.fields)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    const type = await addContentType({ name: body.name, fields: body.fields });
    return NextResponse.json(type, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
