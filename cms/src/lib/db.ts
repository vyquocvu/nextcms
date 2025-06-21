export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
}

export type AdapterType = 'sqlite' | 'mysql' | 'postgresql';

// SQLite implementation
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export class SQLiteAdapter implements DatabaseAdapter {
  private db?: Database;
  constructor(private url: string) {}
  async connect() {
    this.db = await open({ filename: this.url, driver: sqlite3.Database });
  }
  async disconnect() {
    await this.db?.close();
  }
  async query<T = unknown>(sql: string, params: unknown[] = []) {
    if (!this.db) throw new Error('Database not connected');
    return this.db.all<T>(sql, params);
  }
}

// MySQL implementation
import mysql from 'mysql2/promise';
export class MySQLAdapter implements DatabaseAdapter {
  private conn?: mysql.Connection;
  constructor(private url: string) {}
  async connect() {
    this.conn = await mysql.createConnection(this.url);
  }
  async disconnect() {
    await this.conn?.end();
  }
  async query<T = unknown>(sql: string, params: unknown[] = []) {
    if (!this.conn) throw new Error('Database not connected');
    const [rows] = await this.conn.query(sql, params);
    return rows as T[];
  }
}

// PostgreSQL implementation
// @ts-expect-error optional typings for pg
import { Client } from 'pg';
export class PostgresAdapter implements DatabaseAdapter {
  private client: Client;
  constructor(private url: string) {
    this.client = new Client({ connectionString: url });
  }
  async connect() {
    await this.client.connect();
  }
  async disconnect() {
    await this.client.end();
  }
  async query<T = unknown>(sql: string, params: unknown[] = []) {
    const res = await this.client.query<T>(sql, params);
    return res.rows;
  }
}

export function getAdapter(url: string, type: AdapterType): DatabaseAdapter {
  switch (type) {
    case 'mysql':
      return new MySQLAdapter(url);
    case 'postgresql':
      return new PostgresAdapter(url);
    default:
      return new SQLiteAdapter(url);
  }
}
