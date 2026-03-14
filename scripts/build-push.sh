#!/bin/bash
# ============================================================
# build-push.sh — Build et push les 3 images Docker sur Docker Hub
# À exécuter sur TON ORDI après chaque modification.
#
# Usage :
#   bash scripts/build-push.sh             # tag = latest
#   bash scripts/build-push.sh v1.2.0      # tag personnalisé
# ============================================================

set -euo pipefail

# ── Config ───────────────────────────────────────────────────
DOCKERHUB_USER="${DOCKERHUB_USERNAME:-}"
TAG="${1:-latest}"

# Vérifie que le username est défini
if [[ -z "$DOCKERHUB_USER" ]]; then
  echo "❌  DOCKERHUB_USERNAME non défini."
  echo "    Exporte-le : export DOCKERHUB_USERNAME=tonusername"
  exit 1
fi

echo "🔨  Build + push des images (tag: $TAG, user: $DOCKERHUB_USER)"
echo "────────────────────────────────────────────────────────"

# ── Build ─────────────────────────────────────────────────────
echo "▸ Backend..."
docker build \
  --platform linux/amd64 \
  -t "$DOCKERHUB_USER/studio-backend:$TAG" \
  ./backend

echo "▸ Frontend..."
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_API_URL=/api \
  -t "$DOCKERHUB_USER/studio-frontend:$TAG" \
  ./frontend

echo "▸ Nginx..."
docker build \
  --platform linux/amd64 \
  -t "$DOCKERHUB_USER/studio-nginx:$TAG" \
  ./nginx

# ── Push ──────────────────────────────────────────────────────
echo ""
echo "🚀  Push vers Docker Hub..."
docker push "$DOCKERHUB_USER/studio-backend:$TAG"
docker push "$DOCKERHUB_USER/studio-frontend:$TAG"
docker push "$DOCKERHUB_USER/studio-nginx:$TAG"

# Tag 'latest' si on a passé un tag spécifique
if [[ "$TAG" != "latest" ]]; then
  echo ""
  echo "🏷   Tag latest en parallèle..."
  docker tag "$DOCKERHUB_USER/studio-backend:$TAG"  "$DOCKERHUB_USER/studio-backend:latest"
  docker tag "$DOCKERHUB_USER/studio-frontend:$TAG" "$DOCKERHUB_USER/studio-frontend:latest"
  docker tag "$DOCKERHUB_USER/studio-nginx:$TAG"    "$DOCKERHUB_USER/studio-nginx:latest"
  docker push "$DOCKERHUB_USER/studio-backend:latest"
  docker push "$DOCKERHUB_USER/studio-frontend:latest"
  docker push "$DOCKERHUB_USER/studio-nginx:latest"
fi

echo ""
echo "✅  Images publiées sur Docker Hub !"
echo "   Déploie sur le VPS :  bash scripts/deploy.sh"
