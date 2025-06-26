const allMock = jest.fn();
const closeMock = jest.fn();
const openMock = jest.fn().mockResolvedValue({ all: allMock, close: closeMock });
jest.mock('sqlite', () => ({ open: openMock, Database: class {} }));
jest.mock('sqlite3', () => ({ Database: class {} }));

const mysqlQueryMock = jest.fn();
const mysqlEndMock = jest.fn();
const createConnectionMock = jest.fn().mockResolvedValue({
  query: mysqlQueryMock,
  end: mysqlEndMock
});
jest.mock('mysql2/promise', () => ({ createConnection: createConnectionMock }));

const pgQueryMock = jest.fn();
const pgConnectMock = jest.fn();
const pgEndMock = jest.fn();
const ClientMock = jest.fn().mockImplementation(() => ({
  connect: pgConnectMock,
  end: pgEndMock,
  query: pgQueryMock
}));
jest.mock('pg', () => ({ Client: ClientMock }));

import {
  SQLiteAdapter,
  MySQLAdapter,
  PostgresAdapter,
  getAdapter
} from '@/lib/db';

describe('SQLiteAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('connect, query and disconnect', async () => {
    const adapter = new SQLiteAdapter('file.db');
    await adapter.connect();
    expect(openMock).toHaveBeenCalled();
    allMock.mockResolvedValue([{ id: 1 }]);
    const rows = await adapter.query('SELECT 1');
    expect(rows).toEqual([{ id: 1 }]);
    await adapter.disconnect();
    expect(closeMock).toHaveBeenCalled();
  });

  test('query without connection throws', async () => {
    const adapter = new SQLiteAdapter('file.db');
    await expect(adapter.query('SELECT')).rejects.toThrow('Database not connected');
  });
});

describe('MySQLAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('connect, query and disconnect', async () => {
    mysqlQueryMock.mockResolvedValue([[{ ok: true }], undefined]);
    const adapter = new MySQLAdapter('mysql://');
    await adapter.connect();
    expect(createConnectionMock).toHaveBeenCalled();
    const rows = await adapter.query('SELECT');
    expect(rows).toEqual([{ ok: true }]);
    await adapter.disconnect();
    expect(mysqlEndMock).toHaveBeenCalled();
  });

  test('query without connection throws', async () => {
    const adapter = new MySQLAdapter('mysql://');
    await expect(adapter.query('SELECT')).rejects.toThrow('Database not connected');
  });
});

describe('PostgresAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('connect, query and disconnect', async () => {
    pgQueryMock.mockResolvedValue({ rows: [{ x: 1 }] });
    const adapter = new PostgresAdapter('postgres://');
    await adapter.connect();
    expect(ClientMock).toHaveBeenCalledWith({ connectionString: 'postgres://' });
    const rows = await adapter.query('SELECT');
    expect(rows).toEqual([{ x: 1 }]);
    await adapter.disconnect();
    expect(pgEndMock).toHaveBeenCalled();
  });
});

describe('getAdapter', () => {
  test('returns correct adapter by type', () => {
    expect(getAdapter('url', 'mysql')).toBeInstanceOf(MySQLAdapter);
    expect(getAdapter('url', 'postgresql')).toBeInstanceOf(PostgresAdapter);
    expect(getAdapter('url', 'sqlite')).toBeInstanceOf(SQLiteAdapter);
    // default fallback
    expect(getAdapter('url', 'unknown' as any)).toBeInstanceOf(SQLiteAdapter);
  });
});
