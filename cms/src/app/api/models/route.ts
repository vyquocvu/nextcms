import { NextResponse } from 'next/server';
import { getModelNames } from '@/lib/model-schema';

export async function GET() {
  const names = await getModelNames();
  return NextResponse.json(names);
}
