import type { Prisma } from '@prisma/client';
import prisma from './prisma';

export interface ContentField {
  name: string;
}

export interface ContentType {
  name: string;
  fields: ContentField[];
}

export async function getContentTypes() {
  const types = await prisma.contentType.findMany();
  return types.map((t) => ({ name: t.name, fields: t.fields as ContentField[] }));
}

export async function addContentType(type: ContentType) {
  const existing = await prisma.contentType.findUnique({ where: { name: type.name } });
  if (existing) {
    throw new Error('Type already exists');
  }
  return prisma.contentType.create({
    data: { name: type.name, fields: type.fields as unknown as Prisma.JsonValue },
  });
}

export async function getItems(type: string): Promise<Record<string, unknown>[]> {
  const items = await prisma.contentItem.findMany({
    where: { type: { name: type } },
    orderBy: { id: 'asc' },
  });
  return items.map((i) => ({ id: i.id, ...(i.data as Record<string, unknown>) }));
}

export async function addItem(
  type: string,
  item: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const t = await prisma.contentType.findUnique({ where: { name: type } });
  if (!t) throw new Error('Type not found');
  const created = await prisma.contentItem.create({
    data: { typeId: t.id, data: item as Prisma.JsonValue },
  });
  return { id: created.id, ...item };
}
