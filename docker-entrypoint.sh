#!/bin/sh
set -e

echo "Aplicando migrations do Prisma..."
npx prisma migrate deploy

echo "Verificando necessidade de seed..."
node scripts/seed-se-vazio.js

echo "Iniciando API..."
exec node dist/src/main
