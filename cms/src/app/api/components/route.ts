import { addComponent, getComponents, Component } from '@/lib/components';
import { NextResponse } from 'next/server';

export async function GET() {
  const comps = await getComponents();
  return NextResponse.json(comps);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Component;
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  await addComponent(body);
  return NextResponse.json(body, { status: 201 });
}
