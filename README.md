# SI - Soluções Imobiliárias (Backend)

API REST do CRM imobiliário. NestJS, Prisma e PostgreSQL.

## Pré-requisitos

- Node.js 20+
- Docker (para o Postgres local)

## Configuração

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/case_imoveis
JWT_SECRET=segredo-local
JWT_EXPIRES_IN=1d
IA_SERVICE_URL=http://localhost:8000
PORT=3001
```

## Rodar localmente

Suba o banco:

```bash
docker compose up -d postgres
```

Depois:

```bash
npm install
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run start:dev
```

API em http://localhost:3001

### Login do seed

- Email: `admin@solucoesimobiliarias.com`
- Senha: `admin123`

## Rotas principais

- Auth: `POST /auth/cadastro`, `POST /auth/login`, `GET /auth/me`
- Leads: `GET/POST /leads`, `PATCH /leads/:id`, `PATCH /leads/:id/status`
- Imóveis: `GET/POST /imoveis`, `PATCH /imoveis/:id`
- Dashboard: `GET /dashboard/resumo`
- Chatbot: `POST /chatbot/conversa` (proxy para o serviço de IA)

Collection Postman: `postman/collection.json`

## Docker

```bash
docker build -t si-backend .
docker run --env-file .env -p 3001:3001 si-backend
```

No stack completo (docker-compose da raiz), migrations e seed rodam no startup via `docker-entrypoint.sh`.
