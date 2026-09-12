import { getAppData } from '../lib/data.js';
export async function GET() {
  try { return Response.json(await getAppData(), { headers: { 'Cache-Control': 'no-store' } }); }
  catch (error) { console.error(error); return Response.json({ error: 'Não foi possível carregar os dados. Verifique a conexão com o banco.' }, { status: 503 }); }
}
