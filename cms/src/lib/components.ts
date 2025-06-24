import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export interface Component {
  name: string;
  slug: string;
  fields: { name: string; type: string }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const COMPONENT_PATH = path.join(DATA_DIR, 'components.json');

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

export async function getComponents(): Promise<Component[]> {
  return readJSON<Component[]>(COMPONENT_PATH, []);
}

export async function addComponent(component: Component) {
  const comps = await getComponents();
  comps.push(component);
  await writeJSON(COMPONENT_PATH, comps);
}

export async function removeComponent(slug: string) {
  const comps = await getComponents();
  const filtered = comps.filter((c) => c.slug !== slug);
  if (filtered.length === comps.length) return;
  await writeJSON(COMPONENT_PATH, filtered);
}
