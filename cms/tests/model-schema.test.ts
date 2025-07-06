import { jest } from '@jest/globals';

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

import { readFile } from 'fs/promises';
import { getModelNames } from '@/lib/model-schema';

const mockReadFile = readFile as jest.Mock;

const sampleSchema = `
model User { id Int @id }
model Account { id Int @id }
model Post { id Int @id }
`;

describe('getModelNames', () => {
  beforeEach(() => {
    mockReadFile.mockResolvedValue(sampleSchema);
  });

  test('filters to CMS models', async () => {
    const names = await getModelNames();
    expect(names).toEqual(['User', 'Post']);
  });
});
