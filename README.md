# Portail du civisme numérique (RDC)

Plateforme web institutionnelle (information, sensibilisation, signalements) pour la République démocratique du Congo, alignée sur le cadre légal (notamment la loi n° 20/017 relative aux télécommunications et aux TIC, Code pénal, missions de type ARPTC).

## Architecture

| Couche | Technologie |
|--------|-------------|
| Frontend | React (Vite), Bootstrap 5, React Router, Axios, react-i18next (FR + Lingala partiel), react-helmet-async |
| Backend | Node.js, Express, JWT (cookie httpOnly), CSRF sur les écritures, Helmet, rate limiting |
| Données | MongoDB (Mongoose) |

## Prérequis

- Node.js 20+
- MongoDB (local ou Docker)

## Installation

```bash
cd /chemin/vers/cinum
npm run install:all
cp server/.env.example server/.env
```

Éditer `server/.env` :

- `MONGODB_URI` — ex. `mongodb://127.0.0.1:27017/cinum`
- `JWT_SECRET` — **au moins 32 caractères** aléatoires
- `CLIENT_ORIGIN` — origine du front (ex. `http://localhost:5173`)

Démarrer MongoDB (Docker) — le script essaie `docker compose`, puis `docker-compose`, puis un `docker run` si le plugin Compose n’est pas installé :

```bash
npm run db:up
```

(Équivalent manuel : `docker compose up -d` à la racine du dépôt.)

Initialiser les comptes et données de démo :

```bash
npm run seed
```

Comptes par défaut (à modifier en production via variables `SEED_ADMIN_*` / `SEED_MOD_*` dans `.env` si besoin) :

- Administrateur : `admin@cinum-rdc.local` / `ChangeMoi2026!Securise`
- Modérateur : `moderateur@cinum-rdc.local` / `Moderateur2026!`

## Développement

Terminal 1 — API :

```bash
npm run dev:server
```

Terminal 2 — interface (proxy Vite vers l’API sur `/api` et `/uploads`) :

```bash
npm run dev:client
```

Ouvrir `http://localhost:5173`.

**Dépannage — `curl http://127.0.0.1:…/api/...` renvoie 403** : sur macOS, le **port 5000** est souvent utilisé par **AirPlay**, pas par Node. Le projet utilise **5001** par défaut pour l’API (`PORT` dans `server/.env`, proxy Vite aligné). Mettez à jour votre `server/.env` si vous aviez encore `PORT=5000`, redémarrez l’API et le client.

## Production — build frontend

```bash
npm run build
```

Servir le dossier `client/dist` derrière un reverse proxy (HTTPS), avec les en-têtes de sécurité et `CLIENT_ORIGIN` pointant vers l’URL publique du site. Définir `VITE_API_URL` au build si l’API est sur un autre domaine (sinon chemins relatifs `/api`).

## Sécurité (résumé)

- Mots de passe hachés (bcrypt)
- JWT en cookie `httpOnly`, `SameSite=strict`
- Protection CSRF (secret + jeton `X-CSRF-Token`) sur connexion, formulaires publics et routes admin
- Validation des entrées (express-validator), limitation de débit
- Fichiers signalement : types et taille limités (Multer)

## Accessibilité et performance

- Composants Bootstrap, contrastes institutionnels, lien « skip to content »
- Mise en page mobile-first
- Réduction des animations si `prefers-reduced-motion`

## Rôles

- **Administrateur** : suppression d’articles, actualités, ressources, références légales ; gestion complète
- **Modérateur** : création / édition de contenus et traitement des signalements (sans certaines suppressions)

## Licence

Projet exemple à adapter selon la politique de l’entité porteuse.
