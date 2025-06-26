import express from 'express';
import request from 'supertest';

// Mock in-memory storage for all libraries
let collectionTypes: any[] = [];
let collectionEntries: Record<string, any[]> = {};
let contentTypes: any[] = [];
let contentItems: Record<string, any[]> = {};
let singleTypes: any[] = [];
let singleEntries: Record<string, any> = {};
let components: any[] = [];

jest.mock('@/lib/collections', () => ({
  getCollectionTypes: jest.fn(() => collectionTypes),
  addCollectionType: jest.fn((t: any) => { collectionTypes.push(t); }),
  getEntries: jest.fn((slug: string) => collectionEntries[slug] || []),
  addEntry: jest.fn((slug: string, data: any) => {
    const arr = collectionEntries[slug] || (collectionEntries[slug] = []);
    const entry = { id: String(arr.length + 1), ...data };
    arr.push(entry);
    return entry;
  }),
  updateEntry: jest.fn((slug: string, id: string, updates: any) => {
    const arr = collectionEntries[slug] || [];
    const idx = arr.findIndex(e => e.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...updates };
    return arr[idx];
  }),
  deleteEntry: jest.fn((slug: string, id: string) => {
    const arr = collectionEntries[slug] || [];
    const idx = arr.findIndex(e => e.id === id);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    return true;
  })
}));

jest.mock('@/lib/contentTypes', () => ({
  getContentTypes: jest.fn(() => contentTypes),
  addContentType: jest.fn((t: any) => { contentTypes.push(t); return t; }),
  getItems: jest.fn((type: string) => contentItems[type] || []),
  addItem: jest.fn((type: string, item: any) => {
    const arr = contentItems[type] || (contentItems[type] = []);
    const created = { id: arr.length + 1, ...item };
    arr.push(created);
    return created;
  })
}));

jest.mock('@/lib/singles', () => ({
  getSingleTypes: jest.fn(() => singleTypes),
  addSingleType: jest.fn((t: any) => { singleTypes.push(t); }),
  getSingleEntry: jest.fn((slug: string) => singleEntries[slug] || {}),
  updateSingleEntry: jest.fn((slug: string, data: any) => {
    singleEntries[slug] = { ...(singleEntries[slug] || {}), ...data };
    return singleEntries[slug];
  })
}));

jest.mock('@/lib/components', () => ({
  getComponents: jest.fn(() => components),
  addComponent: jest.fn((c: any) => { components.push(c); })
}));

// Load route handlers after mocks
const collectionsTypesRoute = require('../src/app/api/collections/types/route');
const collectionsSlugRoute = require('../src/app/api/collections/[slug]/route');
const collectionsItemRoute = require('../src/app/api/collections/[slug]/[id]/route');
const contentTypesRoute = require('../src/app/api/content-types/route');
const contentTypeRoute = require('../src/app/api/content-types/[type]/route');
const contentItemsRoute = require('../src/app/api/content-types/[type]/items/route');
const singlesTypesRoute = require('../src/app/api/singles/types/route');
const singleEntryRoute = require('../src/app/api/singles/[slug]/route');
const componentsRoute = require('../src/app/api/components/route');

function toExpressResponse(res: Response, expressRes: express.Response) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    res.json().then(data => {
      expressRes.status(res.status).json(data);
    });
  } else {
    res.text().then(t => {
      expressRes.status(res.status).send(t);
    });
  }
}

function buildApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/components', async (_, res) => {
    const r = await componentsRoute.GET();
    toExpressResponse(r, res);
  });
  app.post('/api/components', async (req, res) => {
    const r = await componentsRoute.POST(new Request('http://test', { method: 'POST', body: JSON.stringify(req.body) }));
    toExpressResponse(r, res);
  });

  app.get('/api/content-types', async (_, res) => {
    const r = await contentTypesRoute.GET();
    toExpressResponse(r, res);
  });
  app.post('/api/content-types', async (req, res) => {
    const r = await contentTypesRoute.POST(new Request('http://test', { method: 'POST', body: JSON.stringify(req.body) }));
    toExpressResponse(r, res);
  });
  app.get('/api/content-types/:type', async (req, res) => {
    const r = await contentTypeRoute.GET({} as any, { params: { type: req.params.type } });
    toExpressResponse(r, res);
  });
  app.get('/api/content-types/:type/items', async (req, res) => {
    const r = await contentItemsRoute.GET({} as any, { params: { type: req.params.type } });
    toExpressResponse(r, res);
  });
  app.post('/api/content-types/:type/items', async (req, res) => {
    const r = await contentItemsRoute.POST(new Request('http://test', { method: 'POST', body: JSON.stringify(req.body) }), { params: { type: req.params.type } });
    toExpressResponse(r, res);
  });

  app.get('/api/collections/types', async (_, res) => {
    const r = await collectionsTypesRoute.GET();
    toExpressResponse(r, res);
  });
  app.post('/api/collections/types', async (req, res) => {
    const r = await collectionsTypesRoute.POST(new Request('http://test', { method: 'POST', body: JSON.stringify(req.body) }));
    toExpressResponse(r, res);
  });
  app.get('/api/collections/:slug', async (req, res) => {
    const r = await collectionsSlugRoute.GET({} as any, { params: { slug: req.params.slug } });
    toExpressResponse(r, res);
  });
  app.post('/api/collections/:slug', async (req, res) => {
    const r = await collectionsSlugRoute.POST(new Request('http://test', { method: 'POST', body: JSON.stringify(req.body) }), { params: { slug: req.params.slug } });
    toExpressResponse(r, res);
  });
  app.put('/api/collections/:slug/:id', async (req, res) => {
    const r = await collectionsItemRoute.PUT(new Request('http://test', { method: 'PUT', body: JSON.stringify(req.body) }), { params: { slug: req.params.slug, id: req.params.id } });
    toExpressResponse(r, res);
  });
  app.delete('/api/collections/:slug/:id', async (req, res) => {
    const r = await collectionsItemRoute.DELETE({} as any, { params: { slug: req.params.slug, id: req.params.id } });
    toExpressResponse(r, res);
  });

  app.get('/api/singles/types', async (_, res) => {
    const r = await singlesTypesRoute.GET();
    toExpressResponse(r, res);
  });
  app.post('/api/singles/types', async (req, res) => {
    const r = await singlesTypesRoute.POST(new Request('http://test', { method: 'POST', body: JSON.stringify(req.body) }));
    toExpressResponse(r, res);
  });
  app.get('/api/singles/:slug', async (req, res) => {
    const r = await singleEntryRoute.GET({} as any, { params: { slug: req.params.slug } });
    toExpressResponse(r, res);
  });
  app.put('/api/singles/:slug', async (req, res) => {
    const r = await singleEntryRoute.PUT(new Request('http://test', { method: 'PUT', body: JSON.stringify(req.body) }), { params: { slug: req.params.slug } });
    toExpressResponse(r, res);
  });

  return app;
}

describe('API endpoints', () => {
  let app: express.Express;

  beforeEach(() => {
    collectionTypes = [];
    collectionEntries = {};
    contentTypes = [];
    contentItems = {};
    singleTypes = [];
    singleEntries = {};
    components = [];
    app = buildApp();
  });

  test('components: success and bad request', async () => {
    await request(app).get('/api/components').expect(200, []);
    await request(app)
      .post('/api/components')
      .send({ name: 'Gallery', slug: 'gallery', fields: [] })
      .expect(201);
    await request(app)
      .post('/api/components')
      .send({ name: 'Bad' })
      .expect(400);
  });

  test('content types: create, fetch and validation', async () => {
    await request(app).get('/api/content-types').expect(200, []);
    await request(app)
      .post('/api/content-types')
      .send({ name: 'Post', fields: [] })
      .expect(201);
    await request(app)
      .post('/api/content-types')
      .send({ name: 'Bad' })
      .expect(400);
    await request(app).get('/api/content-types/Unknown').expect(404);
  });

  test('collections: CRUD and errors', async () => {
    await request(app)
      .post('/api/collections/types')
      .send({ name: 'Posts', slug: 'posts', fields: [] })
      .expect(201);
    await request(app)
      .post('/api/collections/types')
      .send({ name: 'Bad' })
      .expect(400);
    await request(app).get('/api/collections/posts').expect(200, []);
    const res = await request(app)
      .post('/api/collections/posts')
      .send({ title: 'Hello' })
      .expect(201);
    const id = res.body.id;
    await request(app)
      .put(`/api/collections/posts/${id}`)
      .send({ title: 'Updated' })
      .expect(200);
    await request(app)
      .put('/api/collections/posts/999')
      .send({ title: 'Nope' })
      .expect(404);
  });

  test('singles endpoints', async () => {
    await request(app)
      .post('/api/singles/types')
      .send({ name: 'Home', slug: 'home', fields: [] })
      .expect(201);
    await request(app)
      .post('/api/singles/types')
      .send({ name: 'Bad' })
      .expect(400);
    await request(app).get('/api/singles/home').expect(200, {});
    await request(app)
      .put('/api/singles/home')
      .send({ title: 'Welcome' })
      .expect(200);
  });
});
