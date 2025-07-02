import prisma from './prisma'

export interface Field {
  name: string
  type: string
}

export interface SingleType {
  name: string
  slug: string
  fields: Field[]
}

export async function getSingleTypes(): Promise<SingleType[]> {
  const types = await prisma.singleType.findMany()
  return types.map((t: { name: string; slug: string; fields: unknown }) => ({
    name: t.name,
    slug: t.slug,
    fields: Array.isArray(t.fields) ? (t.fields as unknown as Field[]) : [],
  }))
}

export async function addSingleType(type: SingleType) {
  await prisma.singleType.create({
    data: {
      name: type.name,
      slug: type.slug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fields: type.fields as any,
    },
  })
}

export async function removeSingleType(slug: string) {
  const type = await prisma.singleType.findUnique({ where: { slug } })
  if (!type) return
  try {
    await prisma.singleEntry.delete({ where: { typeId: type.id } });
  } catch {
    // Ignore error if entry doesn't exist
  }
  try {
    await prisma.singleType.delete({ where: { id: type.id } });
  } catch {
    // Ignore error if type doesn't exist
  }
}

export async function getSingleEntry<T = unknown>(slug: string): Promise<T> {
  const type = await prisma.singleType.findUnique({ where: { slug }, include: { entry: true } })
  return (type?.entry?.data as T) ?? ({} as T)
}

export async function updateSingleEntry<T extends Record<string, unknown>>(slug: string, entry: T) {
  const type = await prisma.singleType.findUnique({ where: { slug } })
  if (!type) throw new Error('Type not found')
  const updated = await prisma.singleEntry.upsert({
    where: { typeId: type.id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: { data: entry as any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: { typeId: type.id, data: entry as any },
  })
  return updated.data as T
}
