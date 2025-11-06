## Estrutura do repositório

- `docker-compose.yml` - configura um serviço `db` com PostgreSQL (porta 5432).
- `.env` - variáveis de ambiente (ex.: `DB_PASSWORD`).
- `backend/` - código do servidor (TypeScript, Fastify, Prisma).
	- `package.json` - scripts e dependências (ver `dev` para desenvolvimento).
	- `prisma/` - esquema do Prisma (`schema.prisma`).
- `frontend/` - atualmente vazio (placeholder).

## O que já foi implementado

- Backend em TypeScript com Fastify.
- Script de desenvolvimento: `npm run dev` dentro de `backend` (usa `ts-node-dev`).
- Prisma configurado com um `schema.prisma` contendo os modelos principais:
	- `User` (id, name, email, password, relaciona com `Message`).
	- `Message` (id, content, role, relação com `User`, timestamps).
- `prisma` está instalado como dependência de desenvolvimento e `@prisma/client` como dependência de runtime.
- `docker-compose.yml` fornece um serviço `db` (Postgres) usando a variável `DB_PASSWORD` do `.env`.

## Variáveis de ambiente

Colocar um arquivo `.env` na raiz (já existe um com `DB_PASSWORD`) contendo pelo menos:

- `DB_PASSWORD` - senha do usuário do banco usada pelo `docker-compose`.
- `DATABASE_URL` - string de conexão do Postgres usada pelo Prisma, por exemplo:

```
DATABASE_URL=postgresql://app:<SENHA>@localhost:5432/test_ia_chat?schema=public
```

Substitua `<SENHA>` pela mesma senha definida em `DB_PASSWORD`.

## Como rodar localmente

1. Iniciar o banco de dados com Docker Compose (na raiz do projeto):

docker-compose up -d

2. No diretório `backend`, instalar dependências e executar em modo dev:

cd backend
npm install
npm run dev

3. Gerar o client do Prisma  e aplicar migrations:

npx prisma generate
# Se quiser criar migrações e sincronizar o banco (ajuste conforme necessário):
npx prisma migrate dev --name init

Observação: verifique se `DATABASE_URL` está corretamente definida no `.env` antes de rodar comandos do Prisma.
