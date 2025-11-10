## Estrutura do repositório

 `dockercompose.yml` — configura o serviço `db` com PostgreSQL (container usa porta 5432; mapeado para a porta `5433` no host).
 `.env` — variáveis de ambiente (ex.: `DB_PASSWORD`, `DATABASE_URL`, `JWT_SECRET`).
 `backend/` — servidor em TypeScript (Fastify + Prisma).
   `package.json` — scripts e dependências.
   `prisma/schema.prisma` — modelos do banco (User, Message) e datasource.
   `src/` — códigofonte: `server.ts`, `routes/`, `plugins/`, `services/`, `schemas/`, `types/`.
 `frontend/` — cliente Vite + React + TypeScript + Tailwind (páginas: Login, Register, Chat, Profile).

## Como rodar 

1) Subir o banco (Docker):

cd testeiagilizafullstack
dockercompose up d db
dockercompose ps

2) Backend (novo terminal):

cd backend
npm install
npx prisma generate
npm run dev

3) Frontend (outro terminal):

cd frontend
npm install
npm run dev

Abra http://localhost:5173 no navegador.

## Endpoints 

 POST /register — criar usuário. Body: { name, email, password }
 POST /login — autenticar. Body: { email, password } → retorna { token, user }
 GET /me — retorna dados do usuário atual (Bearer token)
 GET /messages — lista mensagens do usuário (Bearer token)
 POST /message — cria mensagem do usuário e resposta da IA simulada (Bearer token)

## Como ver o banco 

 Prisma Studio (GUI):

cd backend
npx prisma generate
npx prisma studio

 Docker Desktop: abra o container db → Open in Terminal execute:

psql U app d test_ai_chat
\dt
SELECT * FROM "User";

 Cliente externo: conectar em localhost:5433 com usuário app e senha definida em .env.

## Troubleshooting

 ERR_CONNECTION_REFUSED: backend não está rodando — execute `npm run dev` em `backend`.
 CORS no navegador: reinicie o backend (CORS é aplicado no servidor em onRequest).
 400 ao registrar: dados inválidos — verifique validação no frontend.
 Prisma P1000: cheque `backend/.env` `DATABASE_URL` e credenciais; para recriar DB em dev:

dockercompose down v
dockercompose up d db

## Notas

 Token JWT salvo em `localStorage` e enviado em `Authorization: Bearer <token>`.
 Se houve erro `request.jwtVerify is not a function`, o backend foi atualizado para verificar JWT com `jsonwebtoken` e adicionada declaração de tipos em `backend/src/types/fastify.d.ts`.
 Fluxo do frontend: inicia em Login → Register → Chat (protegido) e Profile (editar nome/email).

## FrontEnd

  Um cliente Axios central (`frontend/src/lib/api.ts`) que:
   possui `baseURL` apontando para `http://localhost:3333`;
   injeta automaticamente o header `Authorization: Bearer <token>` via interceptor;
   exporta helpers `get/post/patch` que retornam `response.data` e normalizam erros.
 Adicionado `zod` ao frontend e criado `frontend/src/schemas/auth.ts` com os schemas:
   `registerSchema`, `loginSchema`, `updateMeSchema` — usados para validar formulários antes de enviar ao backend.
 Páginas atualizadas para usar Axios + Zod: `Login`, `Register`, `Chat`, `Profile`.

## Tema escuro (dark mode)

 Foi adicionado um botão de alternância de tema no cabeçalho (header) que persiste a escolha em `localStorage` e aplica a classe `dark` no elemento `<html>`.
 O Tailwind foi configurado para `darkMode: 'class'` e os componentes principais (forms, botões, cards e mensagens) possuem variantes `dark:` para garantir contraste adequado no modo escuro.
 Arquivo principal afetado: `frontend/src/App.tsx`. As páginas de login, registro, chat e perfil já possuem classes `dark:` para fundos e textos.

## Alteraçoes

 Migração do helper fetch para um cliente Axios central:
   Arquivo: `frontend/src/lib/api.ts`
   Comportamento: `baseURL` apontando para `http://localhost:3333`, interceptor que injeta `Authorization: Bearer <token>` (token lido de `localStorage`) e helpers `get/post/patch` que retornam `response.data`.

 Validação no frontend com Zod:
   Arquivo: `frontend/src/schemas/auth.ts` — schemas: `registerSchema`, `loginSchema`, `updateMeSchema`.
   Uso: formulários em `Login`, `Register` e `Profile` usam `safeParse` para validação antes de enviar dados.

 Páginas atualizadas para usar Axios + Zod:
   `frontend/src/pages/Login.tsx`
   `frontend/src/pages/Register.tsx`
   `frontend/src/pages/Chat.tsx`
   `frontend/src/pages/Profile.tsx`
   `frontend/src/pages/Landing.tsx` (página pública de apresentação/CTA)

 Tema claro/escuro global:
   Controle global em `frontend/src/App.tsx` com botão no header.
   Persistência em `localStorage` (chave `theme`) e aplicação da classe `dark` no elemento `<html>`.
   Tailwind configurado para `darkMode: 'class'` e classes `dark:` aplicadas em componentes principais.

 Dependências adicionadas (frontend):
   `axios` — cliente HTTP centralizado.
   `zod` — validação de esquema no frontend.

 Outros arquivos/ajustes relevantes:
   `frontend/tailwind.config.js` — ativado `darkMode: 'class'` e conteúdo relevante adicionado.
   Tratamento de tipos Axios/TS: pequenas correções para evitar erros de tipagem de headers.

Landing page (página pública)

- Arquivo: `frontend/src/pages/Landing.tsx`
- Comportamento: página pública exibida em `/` quando o usuário não está autenticado. Contém hero, CTAs para Login/Register e uma breve descrição de features.
