jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    singleType: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn()
    },
    singleEntry: {
      upsert: jest.fn(),
      delete: jest.fn()
    }
  }
}));

import prisma from '@/lib/prisma';
import {
  getSingleTypes,
  addSingleType,
  removeSingleType,
  getSingleEntry,
  updateSingleEntry,
  SingleType
} from '@/lib/singles';

const mockPrisma = prisma as unknown as {
  singleType: {
    findMany: jest.Mock;
    create: jest.Mock;
    delete: jest.Mock;
    findUnique: jest.Mock;
  };
  singleEntry: {
    upsert: jest.Mock;
    delete: jest.Mock;
  };
};

describe('singles library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getSingleTypes returns list', async () => {
    mockPrisma.singleType.findMany.mockResolvedValue([
      { name: 'Page', slug: 'page', fields: [] }
    ]);
    const types = await getSingleTypes();
    expect(types).toEqual([{ name: 'Page', slug: 'page', fields: [] }]);
  });

  test('addSingleType calls create', async () => {
    const t: SingleType = { name: 'About', slug: 'about', fields: [] };
    await addSingleType(t);
    expect(mockPrisma.singleType.create).toHaveBeenCalled();
  });

  test('removeSingleType deletes entry and type', async () => {
    mockPrisma.singleType.findUnique.mockResolvedValue({ id: 1 });
    await removeSingleType('page');
    expect(mockPrisma.singleEntry.delete).toHaveBeenCalledWith({ where: { typeId: 1 } });
    expect(mockPrisma.singleType.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test('removeSingleType ignores errors', async () => {
    mockPrisma.singleType.findUnique.mockResolvedValue(null);
    await expect(removeSingleType('missing')).resolves.toBeUndefined();
  });

  test('getSingleEntry returns data', async () => {
    mockPrisma.singleType.findUnique.mockResolvedValue({ entry: { data: { a: 1 } } });
    const data = await getSingleEntry('page');
    expect(data).toEqual({ a: 1 });
  });

  test('getSingleEntry missing returns empty object', async () => {
    mockPrisma.singleType.findUnique.mockResolvedValue(null);
    const data = await getSingleEntry('none');
    expect(data).toEqual({});
  });

  test('updateSingleEntry updates existing entry', async () => {
    mockPrisma.singleType.findUnique.mockResolvedValue({ id: 2 });
    mockPrisma.singleEntry.upsert.mockResolvedValue({ data: { b: 2 } });
    const data = await updateSingleEntry('page', { b: 2 });
    expect(mockPrisma.singleEntry.upsert).toHaveBeenCalledWith({
      where: { typeId: 2 },
      update: { data: { b: 2 } },
      create: { typeId: 2, data: { b: 2 } }
    });
    expect(data).toEqual({ b: 2 });
  });

  test('updateSingleEntry throws when type missing', async () => {
    mockPrisma.singleType.findUnique.mockResolvedValue(null);
    await expect(updateSingleEntry('missing', { x: 1 })).rejects.toThrow('Type not found');
  });
});
