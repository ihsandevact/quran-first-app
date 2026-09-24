export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS protected_apps (
  id TEXT PRIMARY KEY NOT NULL,
  package_name TEXT UNIQUE NOT NULL,
  app_name TEXT NOT NULL,
  icon TEXT,
  enabled INTEGER DEFAULT 1,
  category TEXT DEFAULT 'Other'
);

CREATE TABLE IF NOT EXISTS gate_rules (
  id TEXT PRIMARY KEY NOT NULL,
  protected_app_id TEXT NOT NULL,
  requirement_type TEXT DEFAULT 'VERSE',
  requirement_value INTEGER DEFAULT 5,
  enabled INTEGER DEFAULT 1,
  FOREIGN KEY (protected_app_id) REFERENCES protected_apps(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reading_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  verses_read INTEGER DEFAULT 0,
  source TEXT DEFAULT 'GATE'
);

CREATE TABLE IF NOT EXISTS pending_tilawah (
  id TEXT PRIMARY KEY NOT NULL,
  source_app_id TEXT NOT NULL,
  app_name TEXT NOT NULL,
  verses_required INTEGER NOT NULL,
  verses_completed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS quran_passes (
  id TEXT PRIMARY KEY NOT NULL,
  app_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY NOT NULL,
  surah_number INTEGER NOT NULL,
  ayah_number INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;
