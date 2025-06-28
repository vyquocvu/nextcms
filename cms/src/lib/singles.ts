import type { Prisma } from '@prisma/client'
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
  return types.map(t => ({ name: t.name, slug: t.slug, fields: t.fields as Field[] }))
}

export async function addSingleType(type: SingleType) {
  await prisma.singleType.create({
    data: {
      name: type.name,
      slug: type.slug,
      fields: type.fields as unknown as Prisma.JsonValue,
    },
  })
}

export async function removeSingleType(slug: string) {
  const type = await prisma.singleType.findUnique({ where: { slug } })
  if (!type) return
  await prisma.singleEntry
    .delete({ where: { typeId: type.id } })
    .catch(() => undefined)
  await prisma.singleType.delete({ where: { id: type.id } }).catch(() => undefined)
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
    update: { data: entry as Prisma.JsonValue },
    create: { typeId: type.id, data: entry as Prisma.JsonValue },
  })
  return updated.data as T
}
