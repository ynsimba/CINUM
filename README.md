# Portail du civisme numérique (RDC)

Plateforme web institutionnelle (information, sensibilisation, signalements) pour la République démocratique du Congo, alignée sur le cadre légal (notamment la loi n° 20/017 relative aux télécommunications et aux TIC, Code pénal, missions de type ARPTC).

## Architecture

| Couche | Technologie |
|--------|-------------|
| Frontend | React (Vite), Bootstrap 5, React Router, Axios, react-i18next (FR + Lingala partiel), react-helmet-async |
| Backend | Node.js, Express, JWT (cookie httpOnly), CSRF sur les écritures, Helmet, rate limiting |
| Données | PostgreSQL (Prisma ORM) |

## Prérequis

- Node.js 20+
- PostgreSQL 14+ installé localement (écoute sur `localhost` par défaut)

Créez une base dédiée, par exemple :

```sql
CREATE DATABASE cinum;
```

## Installation

```bash
cd /chemin/vers/cinum
npm run install:all
cp server/.env.example server/.env
```

Éditer `server/.env` :

- `DATABASE_URL` — chaîne PostgreSQL, par ex. `postgresql://USER:PASSWORD@localhost:5432/cinum`
- `JWT_SECRET` — **au moins 32 caractères** aléatoires
- `CLIENT_ORIGIN` — origine du front (ex. `http://localhost:5173`)

### Migrations Prisma

Après la première installation, créez et appliquez le schéma en développement :

```bash
cd server
npx prisma migrate dev
```

Cette commande applique les migrations du dossier `server/prisma/migrations/` et régénère le client Prisma si besoin.

En production ou CI (sans prompt interactif) :

```bash
cd server
npx prisma migrate deploy
```

À la racine du monorepo, équivalents :

```bash
npm run db:migrate:dev   # migrate dev (depuis la racine)
npm run db:migrate       # migrate deploy
```

Le script `postinstall` du serveur exécute `prisma generate` pour disposer du client Prisma après chaque `npm install`.

### Données de démo (comptes + contenu initial)

```bash
npm run seed
```

Si le message indique **« Administrateur déjà présent »**, le mot de passe **en base n’est pas** remis aux valeurs par défaut. Pour **forcer** la réinitialisation (dev uniquement), ajoutez dans `server/.env` :

```env
SEED_UPDATE_PASSWORDS=true
```

puis relancez `npm run seed`, puis **retirez** cette ligne (ou repassez-la à `false`) pour éviter de réécraser les mots de passe par mégarde.

Comptes par défaut (à modifier en production via variables `SEED_ADMIN_*` / `SEED_MOD_*` dans `.env` si besoin) :

- Administrateur : `admin@cinum-rdc.local` / `ChangeMoi2026!Securise`
- Modérateur : `moderateur@cinum-rdc.local` / `Moderateur2026!`

### Raccourci migrate + seed

```bash
npm run setup
```

Exécute `prisma migrate deploy` puis le script de seed (adapter `DATABASE_URL` avant).

## Développement

**Les deux processus en une commande** (API + Vite ; nécessite `npx` / réseau la première fois pour `concurrently`) :

```bash
npm run dev
```

Sinon, deux terminaux :

```bash
npm run dev:server
```

```bash
npm run dev:client
```

Ouvrir `http://localhost:5173`, puis **Connexion** avec un compte seed (voir plus haut) pour accéder à **`/admin`**. En dev sans auth, vous pouvez mettre `DISABLE_ADMIN_AUTH=true` dans `server/.env` et `VITE_DISABLE_ADMIN_AUTH=true` dans `client/.env` (à ne pas utiliser en production).

**Dépannage — `curl http://127.0.0.1:…/api/...` renvoie 403** : sur macOS, le **port 5000** est souvent utilisé par **AirPlay**, pas par Node. Le projet utilise **5001** par défaut pour l’API (`PORT` dans `server/.env`, proxy Vite aligné). Mettez à jour votre `server/.env` si vous aviez encore `PORT=5000`, redémarrez l’API et le client.

## Structure backend (données)

Toutes les routes API (`/api/auth`, `/api/public`, `/api/contact`, `/api/reports`, `/api/admin`) passent par **Prisma** et PostgreSQL. Les pages du site (contenu statique ou données embarquées côté client, ex. quiz) ne parlent pas à la base hors appels à ces API.

- `server/prisma/schema.prisma` — modèles et enums
- `server/prisma/migrations/` — historique SQL des migrations
- `server/lib/prisma.js` — client Prisma (singleton)
- `server/lib/serialize.js` — compatibilité des réponses JSON avec l’ancien format `_id` (Mongoose)
- `server/services/` — accès base et logique métier par domaine (dont `contactService` pour le formulaire **Contact**)

## Production — build frontend

```bash
npm run build
```

Servir le dossier `client/dist` derrière un reverse proxy (HTTPS), avec les en-têtes de sécurité et `CLIENT_ORIGIN` pointant vers l’URL publique du site. Définir `VITE_API_URL` au build si l’API est sur un autre domaine (sinon chemins relatifs `/api`).

Sur le serveur d’API : définir `DATABASE_URL`, lancer `npx prisma migrate deploy`, puis `npm start` dans `server/`.

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
