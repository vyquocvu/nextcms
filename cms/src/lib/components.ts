import type { Prisma } from '@prisma/client';
import prisma from './prisma';

export interface Component {
  name: string;
  slug: string;
  fields: { name: string; type: string }[];
}

export async function getComponents(): Promise<Component[]> {
  const components = await prisma.component.findMany();
  return components.map((c) => ({
    name: c.name,
    slug: c.slug,
    fields: c.fields as { name: string; type: string }[],
  }));
}

export async function addComponent(component: Component) {
  await prisma.component.create({
    data: {
      name: component.name,
      slug: component.slug,
      fields: component.fields as unknown as Prisma.JsonValue,
    },
  });
}
