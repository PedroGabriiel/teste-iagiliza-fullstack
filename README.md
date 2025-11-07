## Estrutura do repositório

- `docker-compose.yml` — configura o serviço `db` com PostgreSQL (container usa porta 5432; mapeado para a porta `5433` no host).
- `.env` — variáveis de ambiente (ex.: `DB_PASSWORD`, `DATABASE_URL`, `JWT_SECRET`).
- `backend/` — servidor em TypeScript (Fastify + Prisma).
  - `package.json` — scripts e dependências.
  - `prisma/schema.prisma` — modelos do banco (User, Message) e datasource.
  - `src/` — código-fonte: `server.ts`, `routes/`, `plugins/`, `services/`, `schemas/`, `types/`.
- `frontend/` — cliente Vite + React + TypeScript + Tailwind (páginas: Login, Register, Chat, Profile).

## Como rodar 

1) Subir o banco (Docker):

```cmd
cd teste-iagiliza-fullstack
docker-compose up -d db
docker-compose ps
```

2) Backend (novo terminal):

```cmd
cd backend
npm install
npx prisma generate
npm run dev
```

3) Frontend (outro terminal):

```cmd
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173 no navegador.

## Endpoints 

- POST /register — criar usuário. Body: { name, email, password }
- POST /login — autenticar. Body: { email, password } → retorna { token, user }
- GET /me — retorna dados do usuário atual (Bearer token)
- GET /messages — lista mensagens do usuário (Bearer token)
- POST /message — cria mensagem do usuário e resposta da IA simulada (Bearer token)

## Como ver o banco 

- Prisma Studio (GUI):

```cmd
cd backend
npx prisma generate
npx prisma studio
```

- Docker Desktop: abra o container `db` → Open in Terminal → execute:

```sh
psql -U app -d test_ai_chat
\dt
SELECT * FROM "User";
```

- Cliente externo: conectar em `localhost:5433` com usuário `app` e senha definida em `.env`.

## Troubleshooting

- ERR_CONNECTION_REFUSED: backend não está rodando — execute `npm run dev` em `backend`.
- CORS no navegador: reinicie o backend (CORS é aplicado no servidor em onRequest).
- 400 ao registrar: dados inválidos — verifique validação no frontend.
- Prisma P1000: cheque `backend/.env` `DATABASE_URL` e credenciais; para recriar DB em dev:

```cmd
docker-compose down -v
docker-compose up -d db
```

## Notas de desenvolvimento

- Token JWT salvo em `localStorage` e enviado em `Authorization: Bearer <token>`.
- Se houve erro `request.jwtVerify is not a function`, o backend foi atualizado para verificar JWT com `jsonwebtoken` e adicionada declaração de tipos em `backend/src/types/fastify.d.ts`.
- Fluxo do frontend: inicia em Login → Register → Chat (protegido) e Profile (editar nome/email).
