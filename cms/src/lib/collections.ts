import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), 'data');
const TYPE_PATH = path.join(DATA_DIR, 'collection-types.json');

async function readJSON<T>(file: string, defaultValue: T): Promise<T> {
  try {
    const data = await readFile(file, 'utf8');
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

async function writeJSON(file: string, data: unknown) {
  await writeFile(file, JSON.stringify(data, null, 2));
}

export async function getCollectionTypes(): Promise<CollectionType[]> {
  return readJSON<CollectionType[]>(TYPE_PATH, []);
}

export async function addCollectionType(type: CollectionType) {
  const types = await getCollectionTypes();
  types.push(type);
  await writeJSON(TYPE_PATH, types);
  await mkdir(path.join(DATA_DIR, type.slug), { recursive: true });
  await writeJSON(path.join(DATA_DIR, type.slug, 'entries.json'), []);
}

export async function getEntries<T = unknown>(slug: string): Promise<T[]> {
  const file = path.join(DATA_DIR, slug, 'entries.json');
  return readJSON<T[]>(file, []);
}

export async function addEntry<T extends Record<string, unknown>>(slug: string, entry: T) {
  const entries = await getEntries<T & { id: string; createdAt: string }>(slug);
  const newEntry = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...entry };
  entries.push(newEntry);
  const file = path.join(DATA_DIR, slug, 'entries.json');
  await writeJSON(file, entries);
  return newEntry;
}
