import { AsyncLocalStorage } from 'node:async_hooks';
import type { IncomingMessage, ServerResponse } from 'node:http';

const context = new AsyncLocalStorage<{ request: Request; outgoing: string[] }>();
export async function cookies() {
  const current = context.getStore();
  if (!current) throw new Error('Cookie access requires a request context.');
  return {
    get(name: string) {
      const raw = (current.request.headers.get('cookie') ?? '').split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
      if (!raw) return undefined;
      try { return { value: decodeURIComponent(raw.slice(name.length + 1)) }; } catch { return undefined; }
    },
    set(name: string, value: string, options: { httpOnly?: boolean; secure?: boolean; sameSite?: string; path?: string; maxAge?: number }) {
      current.outgoing.push(`${name}=${encodeURIComponent(value)}; Path=${options.path ?? '/'}; Max-Age=${options.maxAge ?? 0}${options.httpOnly ? '; HttpOnly' : ''}${options.secure ? '; Secure' : ''}; SameSite=${options.sameSite ?? 'lax'}`);
    },
    delete(name: string) { current.outgoing.push(`${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`); },
  };
}

export async function dispatch(request: Request, handler: (request: Request) => Promise<Response>) {
  const outgoing: string[] = [];
  return context.run({ request, outgoing }, async () => {
    const response = await handler(request);
    outgoing.forEach(cookie => response.headers.append('Set-Cookie', cookie));
    return response;
  });
}

export function nodeHandler(method: string, handler: (request: Request) => Promise<Response>) {
  return async (req: IncomingMessage & { body?: unknown }, res: ServerResponse) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== method) { res.setHeader('Allow', method); res.writeHead(405); res.end(JSON.stringify({ error: 'Método não permitido.' })); return; }
    try {
      let body: string | undefined;
      if (method !== 'GET') {
        if (req.body !== undefined) body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        else {
          const chunks: Buffer[] = []; let length = 0;
          for await (const chunk of req) { const bytes = Buffer.from(chunk); length += bytes.length; if (length > 64000) { res.writeHead(413); res.end(JSON.stringify({ error: 'Requisição muito grande.' })); return; } chunks.push(bytes); }
          body = Buffer.concat(chunks).toString('utf8');
        }
        if (body && Buffer.byteLength(body) > 64000) { res.writeHead(413); res.end(JSON.stringify({ error: 'Requisição muito grande.' })); return; }
      }
      const headers = new Headers();
      for (const [name, value] of Object.entries(req.headers)) if (value) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
      const protocol = process.env.VERCEL ? 'https' : 'http';
      const request = new Request(`${protocol}://${req.headers.host ?? 'localhost'}${req.url ?? '/'}`, { method, headers, body });
      const response = await dispatch(request, handler);
      res.statusCode = response.status;
      response.headers.forEach((value, name) => { if (name !== 'set-cookie') res.setHeader(name, value); });
      const setCookies = response.headers.getSetCookie();
      if (setCookies.length) res.setHeader('Set-Cookie', setCookies);
      res.end(await response.text());
    } catch (error) { console.error(error); res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Não foi possível concluir a solicitação.' })); }
  };
}
