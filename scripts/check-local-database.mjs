import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

// Use an isolated local database. These tests create fictitious records and do
// not delete application data. No session cookies are written to disk.
// Run --phase prepare, restart the server, then run --phase verify.
// Default --phase all checks flows without restarting the server.
// BASE_URL defaults to http://127.0.0.1:5173.
// CHECK_STATE_FILE optionally sets the JSON file carrying IDs between phases.
const base = new URL(process.env.BASE_URL || 'http://127.0.0.1:5173');
assert.equal(base.protocol, 'http:', 'Use a local HTTP server.');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Refusing to write to a non-local host.');
assert.ok(!base.username && !base.password && !base.search && !base.hash, 'BASE_URL cannot contain credentials, query, or fragment.');
assert.equal(base.pathname, '/', 'BASE_URL must point to the application root.');
const args = process.argv.slice(2);
const phase = !args.length ? 'all' : args[0] === '--phase' && args.length === 2 ? args[1] : '';
assert.ok(['all', 'prepare', 'verify'].includes(phase), 'Use --phase prepare, verify, or all.');
const stateFile = resolve(process.env.CHECK_STATE_FILE || join(tmpdir(), 'casablanca-local-check-' + (base.port || '80') + '.json'));
let passed = 0;

function check(condition, label) {
  assert.ok(condition, label);
  console.log('OK ' + (++passed) + ': ' + label);
}
function expect(result, status, label) {
  check(result.status === status, label + ' (esperado ' + status + '; recibido ' + result.status +
    (result.status === status ? '' : ': ' + result.text.slice(0, 300)) + ')');
}
function client() {
  const jar = new Map();
  async function request(path, { method = 'GET', body, headers = {}, useCookies = true } = {}) {
    const outgoing = new Headers(headers);
    if (method !== 'GET' && !outgoing.has('Origin')) outgoing.set('Origin', base.origin);
    if (body !== undefined && !outgoing.has('Content-Type')) outgoing.set('Content-Type', 'application/json');
    if (useCookies && jar.size) outgoing.set('Cookie', [...jar].map(([k, v]) => k + '=' + v).join('; '));
    const response = await fetch(new URL(path, base), {
      method, headers: outgoing,
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
      redirect: 'manual', signal: AbortSignal.timeout(30000),
    });
    const cookies = response.headers.getSetCookie();
    for (const cookie of cookies) {
      const pair = cookie.split(';', 1)[0], separator = pair.indexOf('=');
      if (separator > 0) jar.set(pair.slice(0, separator), pair.slice(separator + 1));
    }
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = null; }
    return { status: response.status, headers: response.headers, cookies, data, text };
  }
  return {
    jar, request,
    post: (action, payload = {}, options = {}) => request('/api/portal', {
      ...options, method: 'POST', body: { action, ...payload },
    }),
  };
}
async function signIn(admin) {
  const result = await admin.request('/api/admin-session', { method: 'POST', body: {} });
  expect(result, 303, 'La sesion local responde con redireccion 303');
  const location = result.headers.get('location');
  check(Boolean(location) && new URL(location, base).origin === base.origin, 'El ingreso redirige dentro del servidor local');
  check(result.cookies.some(c => /;\s*HttpOnly(?:;|$)/i.test(c) && /;\s*SameSite=(?:Lax|Strict)(?:;|$)/i.test(c)),
    'La cookie administrativa es HttpOnly y SameSite');
  const read = await admin.request('/api/portal?mode=admin');
  expect(read, 200, 'La nueva sesion puede leer administracion');
  check(Array.isArray(read.data?.content) && Array.isArray(read.data?.submissions), 'Administracion devuelve contenidos y registros');
  return read.data;
}
async function prepare() {
  const anonymous = client(), marker = randomUUID(), origin = 'PRUEBA LOCAL ' + marker;
  const survey = { age: '18–29', gender: 'Prefiero no responder', origin,
    motivation: 'Patrimonio', spending: 0, days: 1, consent: true };
  // Keep this as the FIRST HTTP request: tables must initialize before any GET.
  let result = await anonymous.post('survey', { data: survey });
  expect(result, 201, 'POST encuesta funciona antes de cualquier GET');
  check(typeof result.data?.id === 'string', 'La encuesta recibe identificador persistente');
  const surveyId = result.data.id;
  result = await anonymous.request('/api/portal');
  expect(result, 200, 'API publica disponible');
  check(Array.isArray(result.data?.content) && result.data.content.some(c => c.id === 'p01'), 'Los contenidos iniciales se crean automaticamente');
  check(!Object.hasOwn(result.data, 'submissions'), 'La API publica no expone formularios');
  check(result.data.content.every(c => c.published), 'La API publica muestra solo contenido publicado');
  const pointId = 'local-check-' + marker;
  const point = { id: pointId, type: 'point', name: 'Parada de prueba ' + marker.slice(0, 8),
    category: 'Patrimonio', description: 'Contenido ficticio exclusivo de la prueba local.',
    image: '/images/valle.jpg', hours: 'Horario inicial de prueba',
    lat: -33.3169, lng: -71.4098, published: true, demo: true, order: 999 };
  expect(await anonymous.request('/api/portal?mode=admin'), 401, 'Administracion rechaza usuarios sin sesion');
  expect(await anonymous.post('save', { content: point }), 401, 'Guardar contenido exige sesion');
  expect(await anonymous.request('/api/portal?mode=admin', {
    headers: { 'oai-authenticated-user-id': 'not-a-session', 'oai-authenticated-user-email': 'test@example.test' },
  }), 401, 'Las antiguas cabeceras de identidad no permiten administrar');
  expect(await anonymous.post('survey', { data: { ...survey, consent: false } }), 400, 'La encuesta exige consentimiento');
  expect(await anonymous.post('survey', { data: { ...survey, days: 0 } }), 400, 'La encuesta valida limites numericos');
  expect(await anonymous.request('/api/portal', { method: 'POST', body: '{' }), 400, 'Se rechaza JSON incompleto');
  expect(await anonymous.post('survey', { data: survey }, { headers: { Origin: 'https://example.test' } }), 403,
    'La API rechaza escritura desde origen externo');
  expect(await anonymous.request('/api/admin-session', {
    method: 'POST', body: {}, headers: { Origin: 'https://example.test' },
  }), 403, 'La sesion administrativa rechaza origen externo');
  const admin = client();
  await signIn(admin);
  const forged = [...admin.jar].map(([name, value]) => name + '=' + value + 'tampered').join('; ');
  expect(await anonymous.request('/api/portal?mode=admin', { useCookies: false, headers: { Cookie: forged } }), 401,
    'Una cookie administrativa alterada no autentica');
  expect(await admin.post('save', { content: point }), 200, 'CMS crea una parada en SQLite');
  point.hours = 'Horario persistente ' + marker.slice(0, 8);
  expect(await admin.post('save', { content: point }), 200, 'CMS actualiza el mismo registro');
  result = await anonymous.request('/api/portal');
  check(result.data.content.some(c => c.id === pointId && c.hours === point.hours), 'La edicion aparece en la API publica');
  expect(await admin.post('save', { content: { ...point, image: 'https://' } }), 400, 'URL invalida produce validacion sin guardar');
  expect(await admin.post('save', { content: { ...point, published: false } }), 200, 'CMS permite ocultar contenido');
  result = await anonymous.request('/api/portal');
  check(!result.data.content.some(c => c.id === pointId), 'El contenido oculto desaparece del portal');
  expect(await admin.post('save', { content: point }), 200, 'CMS permite volver a publicar');
  expect(await anonymous.post('visit', { point: pointId, source: 'qr' }), 200, 'Una parada nueva admite visita QR');
  expect(await anonymous.post('visit', { point: pointId, completed: true }), 200, 'Se guarda el progreso de la parada');
  result = await anonymous.request('/api/portal');
  check(result.data.progress.includes(pointId), 'El progreso queda asociado al visitante');
  result = await anonymous.post('inquiry', { data: { name: 'Consulta de prueba local',
    email: 'prueba@example.test', message: 'Consulta ficticia ' + marker + '.', consent: true } });
  expect(result, 201, 'Se guarda consulta ficticia');
  const inquiryId = result.data.id;
  result = await anonymous.post('provider', { data: { name: 'Prestador ficticio ' + marker.slice(0, 8),
    email: 'prestador@example.test', registration: 'DEMO-' + marker.slice(0, 8),
    category: 'Gastronomía', description: 'Servicio ficticio creado por prueba automatizada.',
    hours: 'Sin horario real', consent: true } });
  expect(result, 201, 'Se guarda solicitud de prestador ficticio');
  const providerId = result.data.id;
  expect(await anonymous.post('review', { id: providerId, status: 'approved', verified: true }), 401, 'Revisar exige sesion');
  expect(await admin.post('review', { id: providerId, status: 'approved', verified: false }), 400, 'Aprobar exige revision manual');
  result = await admin.request('/api/portal?mode=admin');
  check(result.data.submissions.find(s => s.id === providerId)?.status === 'pending' &&
    !result.data.content.some(c => c.id === 'prestador-' + providerId), 'Aprobacion rechazada no modifica estado ni publica');
  expect(await admin.post('review', { id: providerId, status: 'approved', verified: true }), 200, 'Aprobar publica al prestador');
  expect(await admin.post('review', { id: providerId, status: 'approved', verified: true }), 200, 'Repetir aprobacion no genera error');
  expect(await admin.post('review', { id: inquiryId, status: 'reviewed' }), 200, 'La consulta puede marcarse revisada');
  const state = { version: 1, base: base.origin, created: new Date().toISOString(),
    surveyId, origin, inquiryId, providerId, pointId, hours: point.hours };
  await mkdir(dirname(stateFile), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state, null, 2) + '\n', 'utf8');
  console.log('Estado de pruebas: ' + stateFile);
  return state;
}
async function verify(state) {
  check(state.version === 1 && state.base === base.origin, 'Los identificadores corresponden a este servidor');
  const anonymous = client();
  expect(await anonymous.request('/api/portal?mode=admin'), 401, 'Un navegador nuevo empieza sin acceso administrativo');
  const data = await signIn(client());
  check(data.submissions.some(s => s.id === state.surveyId && s.kind === 'survey' && s.data.origin === state.origin),
    'La encuesta guardada permanece en SQLite');
  check(data.submissions.some(s => s.id === state.inquiryId && s.status === 'reviewed'), 'Consulta y estado revisado permanecen');
  check(data.submissions.some(s => s.id === state.providerId && s.status === 'approved'), 'La solicitud conserva su aprobacion');
  const providers = data.content.filter(c => c.id === 'prestador-' + state.providerId);
  check(providers.length === 1 && providers[0].published, 'Existe exactamente un prestador publicado por solicitud');
  check(data.content.some(c => c.id === state.pointId && c.hours === state.hours && c.published),
    'La edicion permanece y la carga inicial no la reemplaza');
  check(data.visits.some(v => v.point === state.pointId && v.source === 'qr' && Number(v.total) === 1 && Number(v.completed) === 1),
    'Visita y finalizacion permanecen sin duplicarse');
  const result = await anonymous.request('/api/portal');
  expect(result, 200, 'El portal publico funciona despues de guardar');
  check(result.data.content.some(c => c.id === state.pointId && c.hours === state.hours), 'El portal presenta el contenido persistido');
}
try {
  console.log('Pruebas locales (' + phase + '): ' + base.origin);
  if (phase === 'verify') await verify(JSON.parse(await readFile(stateFile, 'utf8')));
  else {
    const state = await prepare();
    if (phase === 'all') await verify(state);
  }
  console.log('\n' + passed + ' comprobaciones satisfactorias. Los registros ficticios se conservan.');
  if (phase === 'prepare') console.log('Reinicia el servidor y ejecuta el script con --phase verify.');
  if (phase === 'all') console.log('Para comprobar persistencia entre procesos, usa prepare, reinicia el servidor y ejecuta verify.');
} catch (error) {
  console.error('\nERROR despues de ' + passed + ' comprobaciones: ' + error.message);
  process.exitCode = 1;
}
