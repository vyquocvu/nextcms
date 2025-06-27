import { readFile } from 'fs/promises';
import path from 'path';

const SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');

const SCALAR_TYPES = ['String', 'Int', 'Boolean', 'DateTime', 'Json'];

export interface FieldMeta {
  name: string;
  type: string;
  relationModel?: string;
}

export interface ModelMeta {
  name: string;
  fields: FieldMeta[];
}

export async function getModelNames(): Promise<string[]> {
  const schema = await readFile(SCHEMA_PATH, 'utf8');
  const matches = [...schema.matchAll(/model\s+(\w+)\s+\{/g)];
  return matches.map((m) => m[1]);
}

export async function getModelSchema(model: string): Promise<ModelMeta | null> {
  const schema = await readFile(SCHEMA_PATH, 'utf8');
  const regex = new RegExp(`model\\s+${model}\\s+{([\\s\\S]*?)}`);
  const match = schema.match(regex);
  if (!match) return null;
  const body = match[1];
  const lines = body.split(/\n/).map(l => l.trim()).filter(l => l && !l.startsWith('@@'));
  const fields: FieldMeta[] = [];
  for (const line of lines) {
    if (line.startsWith('//')) continue;
    const [name, rawType] = line.split(/\s+/, 2);
    if (!name || !rawType) continue;
    const type = rawType.replace(/[?\[\]]/g, '');
    const relation = !SCALAR_TYPES.includes(type) ? type : undefined;
    fields.push({ name, type: type.replace(/\?.*/, ''), relationModel: relation });
  }
  return { name: model, fields };
}
