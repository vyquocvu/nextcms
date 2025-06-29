import prisma from './prisma';

export interface Field {
  name: string;
  type: string;
  components?: string[];
}

export interface CollectionType {
  name: string;
  slug: string;
  fields: Field[];
}

export async function getCollectionTypes(): Promise<CollectionType[]> {
  const types = await prisma.collectionType.findMany();
  return types.map((t) => ({
    name: t.name,
    slug: t.slug,
    fields: Array.isArray(t.fields) ? (t.fields as unknown as Field[]) : [],
  }));
}

export async function getCollectionType(
  slug: string
): Promise<CollectionType | null> {
  const types = await getCollectionTypes();
  return types.find((t) => t.slug === slug) || null;
}

export async function addCollectionType(type: CollectionType) {
  await prisma.collectionType.create({
    data: {
      name: type.name,
      slug: type.slug,
      fields: JSON.parse(JSON.stringify(type.fields)),
    },
  });
}

export async function removeCollectionType(slug: string) {
  await prisma.collectionType.delete({ where: { slug } }).catch(() => undefined);
}

export async function getEntries<T = unknown>(slug: string): Promise<T[]> {
  const entries = await prisma.collectionEntry.findMany({
    where: { type: { slug } },
    orderBy: { id: 'asc' },
  });
  return entries.map((e) => ({ id: String(e.id), createdAt: e.createdAt, ...(e.data as T) }));
}

export async function addEntry<T extends Record<string, unknown>>(slug: string, entry: T) {
  const type = await prisma.collectionType.findUnique({ where: { slug } });
  if (!type) throw new Error('Type not found');
  const created = await prisma.collectionEntry.create({
    data: {
      typeId: type.id,
      data: JSON.parse(JSON.stringify(entry)),
    },
  });
  return { id: String(created.id), createdAt: created.createdAt, ...entry } as T & { id: string; createdAt: Date };
}

export async function updateEntry<T extends Record<string, unknown>>(slug: string, id: string, updates: T) {
  const entry = await prisma.collectionEntry.findFirst({
    where: { id: Number(id), type: { slug } },
  });
  if (!entry) return null;
  const data = { ...(entry.data as Record<string, unknown>), ...updates };
  const updated = await prisma.collectionEntry.update({
    where: { id: entry.id },
    data: { data: JSON.parse(JSON.stringify(data)) },
  });
  return { id: String(updated.id), createdAt: updated.createdAt, ...data } as T & { id: string; createdAt: Date };
}

export async function deleteEntry(slug: string, id: string) {
  const entry = await prisma.collectionEntry.findFirst({
    where: { id: Number(id), type: { slug } },
    select: { id: true },
  });
  if (!entry) {
    return false;
  }
  await prisma.collectionEntry.delete({ where: { id: entry.id } });
  return true;
}
