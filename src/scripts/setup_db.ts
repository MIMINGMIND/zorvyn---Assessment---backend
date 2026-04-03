import { dbRun } from '../config/db';

const setupDatabase = async () => {
  try {
    // Users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('VIEWER', 'ANALYST', 'ADMIN')) NOT NULL DEFAULT 'VIEWER',
        status TEXT CHECK(status IN ('ACTIVE', 'INACTIVE')) NOT NULL DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Financial Records table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS financial_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT CHECK(type IN ('INCOME', 'EXPENSE')) NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database schema successfully initialized.');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
  }
};

setupDatabase();
