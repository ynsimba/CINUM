#!/usr/bin/env bash
# Démarre MongoDB : préfère Docker Compose si disponible, sinon conteneur docker run (CLI sans plugin compose).
set -e
cd "$(dirname "$0")/.."

if docker compose version >/dev/null 2>&1; then
  echo "Utilisation de Docker Compose…"
  exec docker compose up -d
fi

if command -v docker-compose >/dev/null 2>&1; then
  echo "Utilisation de docker-compose…"
  exec docker-compose up -d
fi

echo "Compose non disponible : démarrage de MongoDB avec docker run (image mongo:7)…"
docker volume create cinum_mongo_data >/dev/null 2>&1 || true

if docker ps -a --format '{{.Names}}' | grep -qx 'cinum-mongo'; then
  docker start cinum-mongo
  echo "Conteneur cinum-mongo démarré."
else
  docker run -d \
    --name cinum-mongo \
    --restart unless-stopped \
    -p 27017:27017 \
    -v cinum_mongo_data:/data/db \
    mongo:7
  echo "Conteneur cinum-mongo créé et démarré."
fi

echo "MongoDB : mongodb://127.0.0.1:27017"
