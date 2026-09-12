# Rota Viva

MVP de turismo e rotas gamificadas com Vite, React, TypeScript, Tailwind, Prisma e PostgreSQL. Backend em funções Node da Vercel.

## Executar localmente

Com o banco e o `.env` configurados:

```bash
npm run dev
```

Acesse http://localhost:3000. O comando inicia o frontend Vite na porta 3000 e a API local na porta 3001. Encerre o servidor anterior antes de iniciar.

Na primeira instalação:

1. Execute `npm ci`.
2. Copie `.env.example` para `.env` e configure seu PostgreSQL e uma `SESSION_SECRET` aleatória com pelo menos 32 caracteres.
3. Execute `npm run db:generate`, `npm run db:migrate` e `npm run db:seed`.
4. Execute `npm run dev`.

## Publicar na Vercel

O deploy segue a mesma estrutura do projeto Kallyn: frontend Vite em `dist` e funções serverless na pasta `api`.

| Campo | Valor |
| --- | --- |
| Application Preset | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

O arquivo `vercel.json` já declara essas configurações. O build gera o Prisma Client, verifica o TypeScript e cria `dist/index.html`. A Vercel publica o frontend e as funções `api/action.ts` e `api/data.ts` separadamente. O backend mantém autenticação, cookies HTTP-only, roles e acesso ao PostgreSQL. Não é um export estático do backend.

Envie também `package-lock.json`, `vite.config.ts`, `index.html`, `api/` e `src/server/` ao GitHub. Use o commit novo no deploy.

Em **Environment Variables**, configure:

| Variável | Valor |
| --- | --- |
| `DATABASE_URL` | URL de um PostgreSQL acessível pela Vercel, com os parâmetros SSL exigidos pelo provedor |
| `SESSION_SECRET` | Segredo aleatório de pelo menos 32 caracteres |
| `ALLOW_DEMO_LOGIN` | `false` para acesso normal; `true` somente para uma demonstração pública intencional |

O banco local (`localhost` ou `127.0.0.1`) não é acessível pela Vercel. Use um PostgreSQL hospedado. Essas variáveis são exclusivas do servidor: não use prefixos `NEXT_PUBLIC_` ou `VITE_`.

Antes do primeiro acesso, configure temporariamente o `.env` local com a URL do banco hospedado e execute:

```bash
npm run db:migrate
npm run db:seed
```

Isso cria as tabelas, a configuração da plataforma e os dados fictícios. As migrations e o seed não são executados automaticamente durante builds. Use bancos separados para Preview e Production. O arquivo `.env` está ignorado pelo Git.

Envie os arquivos ao GitHub e clique em **Create Project/Deploy** na Vercel. O HTTPS da Vercel permite geolocalização e instalação da PWA.

### Contas de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Visitante | `visitante@rota.demo` | `Demo@2026` |
| Estabelecimento | `parceiro@rota.demo` | `Demo@2026` |
| Admin | `admin@rota.demo` | `Demo@2026` |

O seed cria essas contas mesmo com `ALLOW_DEMO_LOGIN=false`. Para operação real, substitua suas senhas ou desative as contas de demonstração. Com `ALLOW_DEMO_LOGIN=true`, os botões de demonstração dão acesso inclusive ao administrador sem senha.

## Banco e integrações

- `prisma/schema.prisma`: modelos do banco.
- `prisma/migrations/202609120001_initial/migration.sql`: migration aplicada pelo Prisma.
- `migration.sql`: cópia do script inicial para execução manual alternativa. Não execute ambos no mesmo banco.
- As tabelas possuem `chave`, `ativo`, `datahoraalt` e `datahoracad`; triggers atualizam `datahoraalt` também em alterações SQL diretas.
- Lean Fleet: provider mock em `src/lib/lean-fleet.ts`, sem endpoints externos.
- Estrelas: estrutura de 0 a 5, data de expiração e placeholder em `src/lib/stars.ts`; nenhum cálculo por gastos foi definido.
- Visitas exigem GPS e conexão contínuos, com verificação periódica enquanto a tela está aberta. A API usa o relógio do servidor e transações para conceder pontos uma única vez.
- A PWA oferece uma tela offline. Visitas e operações autenticadas precisam de conexão.

## Verificar

```bash
npm test
npm run build
```
