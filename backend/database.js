import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'

let db
let databasePath

function normalizeRows(result) {
  if (!result?.length) return []
  const [{ columns, values }] = result
  return values.map((row) => Object.fromEntries(columns.map((column, index) => [column, row[index]])))
}

export async function initDatabase(filePath) {
  const SQL = await initSqlJs()
  databasePath = path.resolve(filePath)
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })

  if (fs.existsSync(databasePath)) {
    db = new SQL.Database(fs.readFileSync(databasePath))
  } else {
    db = new SQL.Database()
  }

  db.run(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      emoji TEXT NOT NULL DEFAULT '📄',
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS demo_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const demoColumns = normalizeRows(db.exec('PRAGMA table_info(demo_requests)'))
  if (!demoColumns.some((column) => column.name === 'details')) {
    db.run(`ALTER TABLE demo_requests ADD COLUMN details TEXT NOT NULL DEFAULT '{}'`)
  }

  persistDatabase()
  return db
}

export function persistDatabase() {
  if (!db || !databasePath) return
  const bytes = db.export()
  fs.writeFileSync(databasePath, Buffer.from(bytes))
}

export function all(sql, params = []) {
  const statement = db.prepare(sql)
  try {
    statement.bind(params)
    const rows = []
    while (statement.step()) rows.push(statement.getAsObject())
    return rows
  } finally {
    statement.free()
  }
}

export function one(sql, params = []) {
  return all(sql, params)[0] ?? null
}

export function run(sql, params = []) {
  db.run(sql, params)
  const row = normalizeRows(db.exec('SELECT last_insert_rowid() AS id'))[0]
  persistDatabase()
  return Number(row?.id ?? 0)
}
