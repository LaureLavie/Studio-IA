# Éther — Studio de Création Multimédia IA

> Un espace fluide pour générer, assembler et donner vie à tes projets créatifs via l'IA.

**Stack : Next.js 14 · Node/Express · Docker · GitHub Actions → VPS**

---

## Fonctionnalités

| Module | Technologie | Coût |
|---|---|---|
| LLM / Assistant | Groq API — Llama 3 | Gratuit |
| Transcription STT | Groq Whisper large-v3 | Gratuit |
| Synthèse vocale TTS | Edge-TTS (Microsoft) | Gratuit |
| Génération d'images | Pollinations.ai | Gratuit |
| Génération musicale | Hugging Face MusicGen | Gratuit |
| Interface web | Next.js 14 (App Router) | Gratuit |
| API backend | Node.js / Express | Gratuit |
| Reverse proxy + SSL | Nginx + Certbot | Gratuit |
| Hébergement | VPS OVH (déjà payé) | 0 € |

---

## Architecture

```
studio-ia/
├── backend/                  # Node.js / Express API
│   ├── src/
│   │   ├── routes/           # texte.js · image.js · audio.js
│   │   ├── services/         # groq.js · tts.js · music.js · image.js
│   │   ├── middleware/       # errorHandler.js · upload.js
│   │   └── config/           # env.js
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
├── frontend/                 # Next.js 14 App Router
│   ├── src/
│   │   ├── app/              # pages (layout, page, onglets)
│   │   ├── components/       # ui/ · layout/ · studio/
│   │   ├── lib/              # api.js (calls vers backend)
│   │   └── styles/           # globals.css + design system Éther
│   ├── package.json
│   └── Dockerfile
├── nginx/
│   ├── nginx.conf
│   └── Dockerfile
├── scripts/
│   ├── build-push.sh         # build + push Docker Hub (local)
│   └── deploy.sh             # pull + restart (VPS)
├── .github/workflows/
│   └── deploy.yml            # pipeline CI/CD GitHub Actions
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Démarrage rapide (local)

### Prérequis
- Node.js 20+
- Docker + Docker Compose
- Compte [Groq](https://console.groq.com) (gratuit)
- Compte [Hugging Face](https://huggingface.co) (gratuit)

### 1. Cloner et configurer
```bash
git clone https://github.com/TON_USER/studio-ia.git
cd studio-ia
cp .env.example .env
# Édite .env avec tes clés API
```

### 2. Lancer avec Docker (recommandé)
```bash
docker compose up --build
# App dispo sur http://localhost:3000
```

### 3. Lancer sans Docker (dev rapide)
```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev
# API sur http://localhost:4000

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
# UI sur http://localhost:3000
```

---

## Déploiement VPS

### Première installation
```bash
ssh root@TON_IP_VPS
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y
mkdir -p /opt/studio-ia && cd /opt/studio-ia
# Copier docker-compose.yml et .env
scp docker-compose.yml .env root@TON_IP:/opt/studio-ia/
docker compose up -d frontend backend
# SSL
docker compose run certbot certonly --webroot \
  -w /var/www/certbot -d TON_DOMAINE.com \
  --email TON_EMAIL --agree-tos --non-interactive
docker compose up -d nginx certbot
```

### Workflow quotidien
```bash
git add . && git commit -m "feat: ..." && git push
# → GitHub Actions build + push + déploie automatiquement en ~3 min
```

---

## CI/CD — Secrets GitHub requis

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Ton username Docker Hub |
| `DOCKERHUB_TOKEN` | Token Docker Hub (Account Settings → Security) |
| `VPS_HOST` | IP du VPS |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | Clé SSH privée (voir CICD_SETUP.md) |
| `APP_URL` | `https://TON_DOMAINE.com` |

---

## Clés API (toutes gratuites)

| Service | URL | Limite gratuite |
|---|---|---|
| Groq | https://console.groq.com | 14 400 req/jour |
| Hugging Face | https://huggingface.co/settings/tokens | ~1 000 req/jour |
| Pollinations | Aucune clé requise | Illimité |
| Edge-TTS | Aucune clé requise | Illimité |

---

## Commandes utiles

```bash
# Logs en temps réel
docker compose logs -f backend

# Redémarrer un service
docker compose restart backend

# Stats ressources
docker stats

# Entrer dans un conteneur
docker compose exec backend sh
```
# Studio-IA
# test CI/CD
# test CI/CD
