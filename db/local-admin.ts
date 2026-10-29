import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
const runtime = globalThis as typeof globalThis & { __casablancaAdminKey?: Buffer };
const key = runtime.__casablancaAdminKey ||= randomBytes(32);
const duration = 8 * 60 * 60;
export function isLocalRequest(req: Request) {
  const url = new URL(req.url);
  return ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
    && (!req.headers.get('origin') || req.headers.get('origin') === url.origin)
    && req.headers.get('sec-fetch-site') !== 'cross-site';
}
export function adminCookie() {
  const expires = String(Math.floor(Date.now() / 1000) + duration);
  const signature = createHmac('sha256', key).update(expires).digest('hex');
  return 'cb_admin=' + expires + '.' + signature + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + duration;
}
export function isLocalAdmin(req: Request) {
  if (!isLocalRequest(req)) return false;
  const value = req.headers.get('cookie')?.match(/(?:^|;\s*)cb_admin=(\d+)\.([a-f0-9]{64})(?:;|$)/);
  if (!value || Number(value[1]) <= Date.now() / 1000) return false;
  const expected = createHmac('sha256', key).update(value[1]).digest();
  return timingSafeEqual(expected, Buffer.from(value[2], 'hex'));
}
