import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface Field {
  name: string;
  type: string;
}

export interface SingleType {
  name: string;
  slug: string;
  fields: Field[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const TYPE_PATH = path.join(DATA_DIR, 'single-types.json');

async function readJSON<T>(file: string, def: T): Promise<T> {
  try {
    const data = await readFile(file, 'utf8');
    return JSON.parse(data) as T;
  } catch {
    return def;
  }
}

async function writeJSON(file: string, data: unknown) {
  await writeFile(file, JSON.stringify(data, null, 2));
}

export async function getSingleTypes(): Promise<SingleType[]> {
  return readJSON<SingleType[]>(TYPE_PATH, []);
}

export async function addSingleType(type: SingleType) {
  const types = await getSingleTypes();
  types.push(type);
  await writeJSON(TYPE_PATH, types);
  await mkdir(path.join(DATA_DIR, type.slug), { recursive: true });
  await writeJSON(path.join(DATA_DIR, type.slug, 'entry.json'), {});
}

export async function getSingleEntry<T = unknown>(slug: string): Promise<T> {
  const file = path.join(DATA_DIR, slug, 'entry.json');
  return readJSON<T>(file, {} as T);
}

export async function updateSingleEntry<T extends Record<string, unknown>>(
  slug: string,
  entry: T
) {
  const file = path.join(DATA_DIR, slug, 'entry.json');
  await writeJSON(file, entry);
  return entry;
}
