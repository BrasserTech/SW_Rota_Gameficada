import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSameOriginRequest } from '../src/lib/request-origin';
test('accepts public localhost and Vercel hosts behind internal Next.js URLs', () => {
  for (const origin of ['http://localhost:3000', 'https://rota.vercel.app']) {
    assert.equal(isSameOriginRequest(new Request('http://127.0.0.1:3000/api/action', { headers: { origin, host: new URL(origin).host } })), true);
  }
});
test('rejects foreign, missing, malformed origins and cross-site requests', () => {
  for (const origin of ['https://evil.example', 'null', 'https://rota.vercel.app.evil.example']) assert.equal(isSameOriginRequest(new Request('https://rota.vercel.app/api/action', { headers: { origin, host: 'rota.vercel.app' } })), false);
  assert.equal(isSameOriginRequest(new Request('http://localhost:3000/api/action')), false);
  assert.equal(isSameOriginRequest(new Request('http://localhost:3000/api/action', { headers: { origin: 'http://localhost:3000', 'sec-fetch-site': 'cross-site' } })), false);
});
