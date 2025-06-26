jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    component: {
      findMany: jest.fn(),
      create: jest.fn()
    }
  }
}));

import prisma from '@/lib/prisma';
import { getComponents, addComponent, Component } from '@/lib/components';

const mockPrisma = prisma as unknown as {
  component: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

describe('components library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getComponents returns mapped results', async () => {
    mockPrisma.component.findMany.mockResolvedValue([
      { name: 'Comp', slug: 'comp', fields: [{ name: 't', type: 'text' }] }
    ]);
    const comps = await getComponents();
    expect(comps).toEqual([
      { name: 'Comp', slug: 'comp', fields: [{ name: 't', type: 'text' }] }
    ]);
  });

  test('getComponents empty', async () => {
    mockPrisma.component.findMany.mockResolvedValue([]);
    const comps = await getComponents();
    expect(comps).toEqual([]);
  });

  test('addComponent calls prisma.create', async () => {
    const comp: Component = { name: 'Test', slug: 'test', fields: [] };
    await addComponent(comp);
    expect(mockPrisma.component.create).toHaveBeenCalled();
    const arg = mockPrisma.component.create.mock.calls[0][0];
    expect(arg.data.name).toBe('Test');
    expect(arg.data.slug).toBe('test');
  });
});
