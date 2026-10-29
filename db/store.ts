import { sqliteConnection } from './local-database.mjs';
import { seed } from '../app/data';
import type { SQLInputValue } from 'node:sqlite';
class LocalStatement {
  constructor(readonly sql: string, readonly values: SQLInputValue[] = []) {}
  bind(...values: SQLInputValue[]) { return new LocalStatement(this.sql, values); }
  all() { return {results: sqliteConnection().prepare(this.sql).all(...this.values) as Record<string, any>[]}; }
  first<T = Record<string, any>>() { return (sqliteConnection().prepare(this.sql).get(...this.values) || null) as T | null; }
  run() { return sqliteConnection().prepare(this.sql).run(...this.values); }
}
const local = {
  prepare(sql: string) { return new LocalStatement(sql); },
  batch(statements: LocalStatement[]) {
    const connection = sqliteConnection();
    connection.exec('BEGIN IMMEDIATE');
    try { const results = statements.map(statement => statement.run()); connection.exec('COMMIT'); return results; }
    catch (error) { connection.exec('ROLLBACK'); throw error; }
  }
};
// Nombres de las paradas de demostración anteriores. Si una parada conserva ese nombre, nadie la editó
// y se reemplaza una sola vez por la parada oficial del folleto municipal; las ediciones se respetan.
const previousDemoStops: Record<string, string> = {p01:'Plaza de Armas',p02:'Museo de Casablanca',p03:'Entorno del centro histórico',p04:'Memoria de la comunidad',p05:'Arquitectura tradicional',p06:'Patrimonio religioso',p07:'Oficios y vida local',p08:'Sabores de Casablanca',p09:'Encuentros en el valle',p10:'Paisaje y territorio',p11:'Historias del casco histórico',p12:'Cierre del recorrido'};
function upgradeToOfficialRoute() {
  const connection = sqliteConnection();
  if (connection.prepare("SELECT value FROM local_settings WHERE key='official_route_seed'").get()) return;
  const statements = [local.prepare('INSERT OR IGNORE INTO local_settings(key,value) VALUES(?,?)').bind('official_route_seed', new Date().toISOString())];
  for (const item of seed) {
    const row = local.prepare('SELECT data FROM content WHERE id=?').bind(item.id).first<{data: string}>();
    if (!row) continue;
    const stored = JSON.parse(row.data);
    const untouched = item.id === 'casco-historico' ? stored.name === 'Casco Histórico de Casablanca' && String(stored.description).startsWith('Recorre el centro de Casablanca a tu ritmo.') : stored.demo && stored.name === previousDemoStops[item.id];
    if (untouched) statements.push(local.prepare('UPDATE content SET type=?,data=? WHERE id=?').bind(item.type, JSON.stringify({...item, published: stored.published}), item.id));
  }
  local.batch(statements);
}
export function database() {
  sqliteConnection();
  local.batch(seed.map(item => local.prepare('INSERT OR IGNORE INTO content(id,type,data) VALUES(?,?,?)').bind(item.id,item.type,JSON.stringify(item))));
  upgradeToOfficialRoute();
  return local;
}
export async function ensureSeed() { return database(); }
