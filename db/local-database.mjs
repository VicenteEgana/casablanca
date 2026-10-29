import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
export const databasePath = path.resolve(process.env.CASABLANCA_DB_PATH || 'datos/casablanca.sqlite');
const connections = globalThis.__casablancaDatabases ||= new Map();
const schema = `
CREATE TABLE IF NOT EXISTS content (id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY NOT NULL, kind TEXT NOT NULL, data TEXT NOT NULL, status TEXT DEFAULT 'pending' NOT NULL, created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS visits (visitor TEXT NOT NULL, point TEXT NOT NULL, source TEXT NOT NULL, completed INTEGER DEFAULT 0 NOT NULL, created TEXT NOT NULL, PRIMARY KEY(visitor,point));
CREATE TABLE IF NOT EXISTS local_settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
`;
function migratePreviousLocalDatabase(target) {
  if (process.env.CASABLANCA_DB_PATH) return;
  if (target.prepare("SELECT value FROM local_settings WHERE key='previous_database_checked'").get()) return;
  const previous = path.resolve('.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
  const files = existsSync(previous) ? readdirSync(previous).filter(f => f.endsWith('.sqlite') && f !== 'metadata.sqlite') : [];
  const sources = [];
  try {
    for (const filename of files) {
      const source = new DatabaseSync(path.join(previous, filename), { readOnly: true });
      const names = source.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(row => row.name);
      if (['content', 'submissions', 'visits'].every(name => names.includes(name))) sources.push(source);
      else source.close();
    }
    if (sources.length > 1) throw new Error('Hay varias bases locales anteriores. Conserva .wrangler/state y revisa cuál importar antes de continuar.');
    target.exec('BEGIN IMMEDIATE');
    try {
      if (sources[0]) {
        for (const [table, columns] of [['content', ['id', 'type', 'data']], ['submissions', ['id', 'kind', 'data', 'status', 'created']], ['visits', ['visitor', 'point', 'source', 'completed', 'created']]]) {
          const insert = target.prepare('INSERT OR IGNORE INTO ' + table + ' (' + columns.join(',') + ') VALUES (' + columns.map(() => '?').join(',') + ')');
          for (const row of sources[0].prepare('SELECT ' + columns.join(',') + ' FROM ' + table).all()) insert.run(...columns.map(column => row[column]));
        }
        console.log('Datos de la base local anterior importados; el archivo original se conserva.');
      }
      target.prepare('INSERT INTO local_settings(key,value) VALUES(?,?)').run('previous_database_checked', new Date().toISOString());
      target.exec('COMMIT');
    } catch (error) { target.exec('ROLLBACK'); throw error; }
  } finally { for (const source of sources) source.close(); }
}
export function sqliteConnection() {
  if (!connections.has(databasePath)) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
    const connection = new DatabaseSync(databasePath);
    try {
      connection.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
      connection.exec(schema);
      migratePreviousLocalDatabase(connection);
      connections.set(databasePath, connection);
    } catch (error) { connection.close(); throw error; }
  }
  return connections.get(databasePath);
}
