import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

const DB_NAME = 'quran_first.db';

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await db.execAsync(CREATE_TABLES_SQL);
  return db;
}
