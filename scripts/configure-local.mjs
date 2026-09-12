import fs from 'node:fs';
import crypto from 'node:crypto';
fs.writeFileSync('.env', `DATABASE_URL="postgresql://rota@127.0.0.1:55432/rota_mvp?schema=public"\nSESSION_SECRET="${crypto.randomBytes(48).toString('hex')}"\nALLOW_DEMO_LOGIN="true"\n`);
console.log('Ambiente local configurado.');
