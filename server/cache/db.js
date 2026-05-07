const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DATA_DIR = path.join(__dirname, '..', 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(path.join(DATA_DIR, 'cache.db'))

db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS themes (
    id         INTEGER PRIMARY KEY,
    parent_id  INTEGER,
    name       TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sets (
    set_num    TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    year       INTEGER,
    theme_id   INTEGER,
    theme_name TEXT,
    num_parts  INTEGER DEFAULT 0,
    img_url    TEXT,
    is_retired INTEGER DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_sets_name ON sets(name COLLATE NOCASE);

  CREATE TABLE IF NOT EXISTS set_minifigs (
    set_num  TEXT PRIMARY KEY,
    num_figs INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cache_meta (
    key   TEXT PRIMARY KEY,
    value TEXT
  );
`)

module.exports = db
