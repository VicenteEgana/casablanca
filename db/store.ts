import {env} from 'cloudflare:workers';import {seed} from '../app/data';
export function database(){if(!env.DB)throw new Error('Base de datos no disponible');return env.DB;}
export async function ensureSeed(){const db=database();await db.batch(seed.map(c=>db.prepare('INSERT OR IGNORE INTO content (id,type,data) VALUES (?,?,?)').bind(c.id,c.type,JSON.stringify(c))));return db;}
