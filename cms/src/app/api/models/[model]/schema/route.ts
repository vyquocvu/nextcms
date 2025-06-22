/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server';
import { getModelSchema } from '@/lib/model-schema';

export async function GET(_req: NextRequest, context: unknown) {
  const params = (context as any).params as { model: string };
  const schema = await getModelSchema(params.model);
  if (!schema) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }
  return NextResponse.json(schema);
}
