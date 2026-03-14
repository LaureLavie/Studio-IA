# Guide CI/CD — Configuration complète
## Éther Studio — Next.js + Node/Express + Docker + GitHub Actions → VPS

---

## Vue d'ensemble du pipeline

```
git push main
  → GitHub Actions (VM Ubuntu gratuite)
    → docker build × 3  (backend, frontend, nginx)
    → docker push        (Docker Hub)
    → ssh VPS
      → docker compose pull
      → docker compose up -d
  → Health check automatique
  → Résumé dans l'onglet Actions
```

Durée moyenne : **3–5 minutes** par déploiement.
Quota gratuit GitHub Actions : **2 000 min/mois** (~400 déploiements).

---

## Étape 1 — Token Docker Hub

1. Va sur https://hub.docker.com
2. Avatar → **Account Settings** → **Security** → **New Access Token**
3. Nom : `studio-ia-github-actions` · Permissions : **Read & Write**
4. **Copie le token** (affiché une seule fois !)

---

## Étape 2 — Clé SSH dédiée CI/CD

Sur **ton ordi** (pas le VPS) :

```bash
# Génère la paire de clés
ssh-keygen -t ed25519 -C "github-actions-studio-ia" -f ~/.ssh/studio_ia_deploy

# Affiche la clé publique → à copier sur le VPS
cat ~/.ssh/studio_ia_deploy.pub

# Affiche la clé privée → à copier dans le secret GitHub VPS_SSH_KEY
cat ~/.ssh/studio_ia_deploy
```

Sur le **VPS** :

```bash
ssh root@TON_IP_VPS
mkdir -p ~/.ssh
# Colle ici la clé PUBLIQUE
echo "ssh-ed25519 AAAA... github-actions-studio-ia" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Test de connexion depuis ton ordi (doit fonctionner sans mot de passe)
ssh -i ~/.ssh/studio_ia_deploy root@TON_IP_VPS "echo OK"
```

---

## Étape 3 — Secrets GitHub

Repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Valeur | Exemple |
|---|---|---|
| `DOCKERHUB_USERNAME` | Ton username Docker Hub | `marie123` |
| `DOCKERHUB_TOKEN` | Token créé à l'étape 1 | `dckr_pat_xxxx` |
| `VPS_HOST` | IP du VPS | `65.21.123.45` |
| `VPS_USER` | Utilisateur SSH | `root` |
| `VPS_SSH_KEY` | **Clé privée entière** | `-----BEGIN OPENSSH...` |
| `APP_URL` | URL de ton app | `https://studio.mondomaine.com` |

> ⚠️ Pour `VPS_SSH_KEY` : copie **tout** le contenu du fichier, y compris les lignes `-----BEGIN` et `-----END`.

---

## Étape 4 — Première installation du VPS

```bash
ssh root@TON_IP_VPS

# 1. Installer Docker
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin

# 2. Créer le dossier de l'app
mkdir -p /opt/studio-ia
cd /opt/studio-ia

# 3. Copier docker-compose.yml et .env depuis ton ordi
# (depuis ton ordi dans un autre terminal :)
scp docker-compose.yml .env root@TON_IP_VPS:/opt/studio-ia/

# 4. Créer le .env sur le VPS avec tes clés API
nano /opt/studio-ia/.env
# Contenu :
#   GROQ_API_KEY=gsk_xxxxx
#   HF_API_KEY=hf_xxxxx
#   NODE_ENV=production
#   DOCKERHUB_USERNAME=tonusername

# 5. Premier lancement (sans SSL d'abord pour tester)
docker compose up -d frontend backend
curl http://localhost:3000   # doit retourner du HTML
```

---

## Étape 5 — Configurer Nginx + SSL

```bash
# Sur le VPS — modifier TON_DOMAINE.com dans nginx.conf AVANT de builder
# (ou passer par une variable dans le Dockerfile nginx)

# Pointer ton domaine → IP du VPS chez ton registrar DNS
# Enregistrement A : studio.mondomaine.com → IP_VPS

# Attendre la propagation DNS (2–30 min), puis :
docker compose run certbot certonly \
  --webroot -w /var/www/certbot \
  -d TON_DOMAINE.com \
  --email TON_EMAIL@exemple.com \
  --agree-tos --non-interactive

# Lancer nginx avec HTTPS
docker compose up -d nginx certbot
curl https://TON_DOMAINE.com   # ✅
```

---

## Étape 6 — Premier déploiement via CI/CD

```bash
# Sur ton ordi
echo "# first deploy" >> README.md
git add .
git commit -m "ci: premier déploiement automatique"
git push origin main
```

Va sur **GitHub → onglet Actions** : tu verras le pipeline tourner en direct.

---

## Workflow quotidien

```bash
# Tu codes, tu testes en local, puis :
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
# → 3–5 min plus tard, l'app est à jour sur le VPS
```

---

## Dépannage

```bash
# Voir les logs du pipeline
# GitHub → Actions → cliquer sur le run → développer chaque étape

# Voir les logs sur le VPS
ssh root@TON_IP_VPS "docker compose -f /opt/studio-ia/docker-compose.yml logs -f --tail=100"

# Relancer le dernier déploiement manuellement
# GitHub → Actions → workflow → "Re-run all jobs"

# Tester le backend directement
curl https://TON_DOMAINE.com/api/

# Entrer dans un conteneur pour déboguer
ssh root@TON_IP_VPS "docker compose -f /opt/studio-ia/docker-compose.yml exec backend sh"
```
