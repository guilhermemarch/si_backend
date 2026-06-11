# SI - Backend

API em NestJS para um CRM imobiliario simples com usuarios, leads, imoveis, dashboard e integracao com microsservico de IA.

## Tecnologias

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- class-validator
- Docker Compose

## Requisitos

- Node.js 20+
- npm
- Docker, para subir o PostgreSQL localmente

## Configuracao

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Exemplo de `.env` para desenvolvimento local (backend fora do Docker):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/case_imoveis"
JWT_SECRET="segredo-local"
JWT_EXPIRES_IN="1d"
IA_SERVICE_URL="http://localhost:8000"
PORT=3001
```

Para subir o stack completo (frontend, backend, IA e banco), use o [`docker-compose.yml`](../docker-compose.yml) na raiz do monorepo.

## Instalacao

```bash
npm install
```

## Banco de dados

### Desenvolvimento local

Suba apenas o PostgreSQL:

```bash
docker compose up -d postgres
```

Rode as migrations:

```bash
npx prisma migrate deploy
```

Gere o client do Prisma:

```bash
npx prisma generate
```

Rode o seed:

```bash
npm run seed
```

### Docker (stack na raiz)

Ao subir o backend pelo `docker compose up` da raiz, o entrypoint (`docker-entrypoint.sh`) executa automaticamente:

1. `prisma migrate deploy`
2. seed apenas se o banco estiver vazio (`scripts/seed-se-vazio.js`)
3. inicio da API

Usuario admin criado pelo seed:

```txt
Email: admin@solucoesimobiliarias.com
Senha: admin123
```

## Execucao local

```bash
npm run start:dev
```

A API roda em:

```txt
http://localhost:3001
```

## Docker

Build da imagem:

```bash
docker build -t case-imoveis-backend .
```

Execucao da imagem:

```bash
docker run --env-file .env -p 3001:3001 case-imoveis-backend
```

## Rotas principais

Autenticacao:

- `POST /auth/cadastro`
- `POST /auth/login`
- `GET /auth/me`

Leads:

- `POST /leads`
- `GET /leads`
- `GET /leads/:id`
- `PATCH /leads/:id`
- `PATCH /leads/:id/status`
- `DELETE /leads/:id`

Imoveis:

- `POST /imoveis`
- `GET /imoveis`
- `GET /imoveis/:id`
- `PATCH /imoveis/:id`
- `DELETE /imoveis/:id`

Dashboard e chatbot:

- `GET /dashboard/resumo`
- `POST /chatbot/conversa`

## Postman

A collection esta em:

```txt
postman/collection.json
```

Importe no Postman, execute login e use a variavel `token` nas rotas privadas.

## Integracao com IA

O backend chama o microsservico IA em `IA_SERVICE_URL`.

Fluxo:

```txt
Frontend -> Backend -> IA -> Groq
```

O frontend nao chama Groq e nao chama o servico IA diretamente.

## Decisoes tecnicas

- Autenticacao propria com email, senha com bcrypt e JWT simples.
- Sem refresh token neste MVP.
- Dados compartilhados entre usuarios, sem multiempresa.
- Status de leads sao enums fixos no Prisma.
- Imoveis foram mantidos simples, sem campos extras fora do escopo.
- O backend monta contexto real antes de chamar a IA.

## Proximos passos

- Adicionar Swagger, se for necessario para avaliacao.
- Melhorar tratamento visual de erros no frontend.
- Adicionar testes automatizados em uma etapa futura.
