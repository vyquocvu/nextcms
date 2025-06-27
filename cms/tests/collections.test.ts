import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';

let originalCwd: string;
let tempDir: string;

function setupFiles() {
  mkdirSync(path.join(tempDir, 'data', 'posts'), { recursive: true });
  writeFileSync(path.join(tempDir, 'data', 'collection-types.json'), '[]');
  writeFileSync(path.join(tempDir, 'data', 'posts', 'entries.json'), '[]');
}

function loadRoutes() {
  return {
    types: require('../src/app/api/collections/types/route'),
    collection: require('../src/app/api/collections/[slug]/route'),
    item: require('../src/app/api/collections/[slug]/[id]/route')
  };
}

beforeEach(() => {
  originalCwd = process.cwd();
  tempDir = mkdtempSync(path.join(os.tmpdir(), 'cms-test-'));
  mkdirSync(path.join(tempDir, 'data'));
  setupFiles();
  process.chdir(tempDir);
  jest.resetModules();
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(tempDir, { recursive: true, force: true });
});

test.skip('create collection type and manage entries', async () => {
  const routes = loadRoutes();

  let res = await routes.types.GET();
  expect(await res.json()).toEqual([]);

  res = await routes.types.POST(new Request('http://test', {
    method: 'POST',
    body: JSON.stringify({ name: 'Posts', slug: 'posts', fields: [] })
  }));
  expect(res.status).toBe(201);

  res = await routes.collection.GET({} as any, { params: { slug: 'posts' } });
  expect(await res.json()).toEqual([]);

  res = await routes.collection.POST(new Request('http://test', {
    method: 'POST',
    body: JSON.stringify({ title: 'First' })
  }), { params: { slug: 'posts' } });
  const entry = await res.json();

  res = await routes.item.PUT(new Request('http://test', {
    method: 'PUT',
    body: JSON.stringify({ title: 'Updated' })
  }), { params: { slug: 'posts', id: entry.id } });
  expect((await res.json()).title).toBe('Updated');
});
