import { createServer } from 'node:http';
import { loadEnv } from 'vite';
Object.assign(process.env, loadEnv('development', process.cwd(), ''));
const { default: action } = await import('../api/action.js');
const { default: data } = await import('../api/data.js');
createServer(async (req, res) => {
  const path = req.url?.split('?')[0];
  if (path === '/api/action') return action(req, res);
  if (path === '/api/data') return data(req, res);
  res.writeHead(404); res.end();
}).listen(3001, '127.0.0.1', () => console.log('API local: http://127.0.0.1:3001'));
