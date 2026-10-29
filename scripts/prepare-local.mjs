import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
const { sqliteConnection, databasePath } = await import('../db/local-database.mjs');
sqliteConnection();
console.log('Base SQLite local lista: ' + databasePath);
