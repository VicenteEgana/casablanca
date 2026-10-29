import { adminCookie, isLocalRequest } from '../../../db/local-admin';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  if (!isLocalRequest(req)) return Response.json({error:'La administración solo está disponible en este computador.'}, {status:403});
  return new Response(null, {status:303, headers:{Location:'/#admin', 'Set-Cookie':adminCookie(), 'Cache-Control':'no-store'}});
}
export async function DELETE(req: Request) {
  if (!isLocalRequest(req)) return Response.json({error:'Origen no permitido'}, {status:403});
  return Response.json({ok:true}, {headers:{'Set-Cookie':'cb_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0', 'Cache-Control':'no-store'}});
}
