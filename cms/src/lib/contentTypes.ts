import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const TYPES_PATH = path.join(process.cwd(), 'data', 'content-types.json');

export interface ContentField {
  name: string;
}

export interface ContentType {
  name: string;
  fields: ContentField[];
}

async function readTypes(): Promise<ContentType[]> {
  try {
    const data = await readFile(TYPES_PATH, 'utf8');
    return JSON.parse(data) as ContentType[];
  } catch {
    return [];
  }
}

async function writeTypes(types: ContentType[]) {
  await writeFile(TYPES_PATH, JSON.stringify(types, null, 2));
}

export async function getContentTypes() {
  return readTypes();
}

export async function addContentType(type: ContentType) {
  const types = await readTypes();
  const existing = types.find((t) => t.name === type.name);
  if (existing) {
    throw new Error('Type already exists');
  }
  types.push(type);
  await writeTypes(types);
  await writeFile(path.join(process.cwd(), 'data', `${type.name}.json`), '[]');
  return type;
}

async function getItemsPath(type: string) {
  return path.join(process.cwd(), 'data', `${type}.json`);
}

export async function getItems(type: string): Promise<Record<string, unknown>[]> {
  try {
    const file = await readFile(await getItemsPath(type), 'utf8');
    return JSON.parse(file) as Record<string, unknown>[];
  } catch {
    return [];
  }
}

export async function addItem(
  type: string,
  item: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const items = await getItems(type);
  const newItem = { id: Date.now().toString(), ...item };
  items.push(newItem);
  await writeFile(await getItemsPath(type), JSON.stringify(items, null, 2));
  return newItem;
}
