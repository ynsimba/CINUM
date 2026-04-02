#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

if docker compose version >/dev/null 2>&1; then
  exec docker compose down
fi

if command -v docker-compose >/dev/null 2>&1; then
  exec docker-compose down
fi

if docker ps -a --format '{{.Names}}' | grep -qx 'cinum-mongo'; then
  docker stop cinum-mongo
  echo "Conteneur cinum-mongo arrêté."
else
  echo "Aucun conteneur cinum-mongo à arrêter."
fi
