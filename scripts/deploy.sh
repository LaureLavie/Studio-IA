#!/bin/bash
# ============================================================
# deploy.sh — Mise à jour de l'app sur le VPS
# À exécuter directement sur le VPS (ou via SSH depuis l'ordi).
#
# Usage sur le VPS :
#   bash /opt/studio-ia/scripts/deploy.sh
#
# Usage depuis ton ordi (déploiement manuel) :
#   ssh root@TON_IP_VPS "bash /opt/studio-ia/scripts/deploy.sh"
# ============================================================

set -euo pipefail

APP_DIR="/opt/studio-ia"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"

echo "🚀  Déploiement Éther Studio..."
echo "────────────────────────────────────────────────────────"

# Vérifie que le dossier existe
if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌  docker-compose.yml introuvable dans $APP_DIR"
  echo "    Copie-le d'abord : scp docker-compose.yml root@VPS:$APP_DIR/"
  exit 1
fi

cd "$APP_DIR"

# Pull les dernières images depuis Docker Hub
echo "▸ Pull des dernières images..."
docker compose pull

# Redémarre avec les nouvelles images (zéro downtime)
echo "▸ Redémarrage des services..."
docker compose up -d --remove-orphans

# Nettoyage des anciennes images pour libérer de l'espace disque
echo "▸ Nettoyage des anciennes images..."
docker image prune -f

echo ""
echo "✅  Déploiement terminé — $(date '+%d/%m/%Y %H:%M:%S')"
echo ""
docker compose ps
