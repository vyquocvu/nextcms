import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';

let originalCwd: string;
let tempDir: string;

function loadRoutes() {
  return {
    main: require('../src/app/api/content-types/route'),
    type: require('../src/app/api/content-types/[type]/route'),
    items: require('../src/app/api/content-types/[type]/items/route')
  };
}

beforeEach(() => {
  originalCwd = process.cwd();
  tempDir = mkdtempSync(path.join(os.tmpdir(), 'cms-test-'));
  mkdirSync(path.join(tempDir, 'data'));
  writeFileSync(path.join(tempDir, 'data', 'content-types.json'), '[]');
  process.chdir(tempDir);
  jest.resetModules();
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(tempDir, { recursive: true, force: true });
});

test.skip('create and fetch content type with items', async () => {
  const routes = loadRoutes();

  let res = await routes.main.GET();
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual([]);

  res = await routes.main.POST(new Request('http://test', {
    method: 'POST',
    body: JSON.stringify({ name: 'Post', fields: [] })
  }));
  expect(res.status).toBe(201);
  const created = await res.json();
  expect(created.name).toBe('Post');

  res = await routes.type.GET({} as any, { params: { type: 'Post' } });
  expect(res.status).toBe(200);
  expect((await res.json()).name).toBe('Post');

  res = await routes.items.GET({} as any, { params: { type: 'Post' } });
  expect(await res.json()).toEqual([]);

  res = await routes.items.POST(new Request('http://test', {
    method: 'POST',
    body: JSON.stringify({ title: 'Hello' })
  }), { params: { type: 'Post' } });
  expect(res.status).toBe(201);
  const item = await res.json();
  expect(item.title).toBe('Hello');
});
