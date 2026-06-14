#!/bin/sh
set -e

echo "Iniciando API..."
exec node dist/src/main
