# Note conceptuelle — Portail du civisme numérique (CINUM, RDC)

## 1. Objet et finalité

Le **portail CINUM** (civisme numérique — République démocratique du Congo) est une **plateforme web institutionnelle** à vocation **informationnelle, pédagogique et opérationnelle**. Elle vise à :

- **Informer** les citoyens sur leurs **droits et devoirs** dans l’espace numérique ;
- **Sensibiliser** aux bonnes pratiques, à la prévention des abus (harcèlement, désinformation, fraude, usurpation, etc.) ;
- **Donner accès** à des contenus structurés (articles, actualités, ressources, références légales, espace éducatif) ;
- **Permettre le signalement** de situations problématiques via un parcours encadré, avec suivi par référence et code secret ;
- **Offrir un canal de contact** institutionnel pour les questions du public.

Le site s’inscrit dans une logique de **service public numérique** et de **cohérence avec le cadre légal congolais**, notamment la **loi n° 20/017** relative aux télécommunications et aux TIC, ainsi que les textes pénaux et réglementaires pertinents. Les contenus à vocation pédagogique **ne se substituent pas** à un conseil juridique personnalisé.

---

## 2. Contexte et positionnement

### 2.1 Contexte national

La RDC connaît une **forte adoption du numérique** (téléphonie mobile, réseaux sociaux, services en ligne). Les enjeux associés — **protection des personnes**, **lutte contre la cybercriminalité**, **régulation des communications** et **éducation aux médias** — appellent un **point d’entrée institutionnel clair** pour le grand public et les partenaires.

### 2.2 Positionnement du portail

CINUM se positionne comme :

- un **guichet unique thématique** « civisme numérique » ;
- un **support de communication** pour les campagnes et actualités liées au numérique responsable ;
- un **outil de traçabilité** pour certains flux (signalements, messages de contact, journalisation d’actions d’administration) ;
- un **socle technique** évolutif (contenus éditoriaux, formulaires, API sécurisée).

---

## 3. Publics cibles et besoins

| Public | Besoins principaux |
|--------|-------------------|
| **Citoyens et usagers du numérique** | Comprendre droits et devoirs, s’orienter vers les bonnes pratiques, signaler un problème, poser une question. |
| **Éducateurs et médiateurs** | Ressources pédagogiques, actualités, liens vers le cadre légal. |
| **Personnel administratif** | Rédiger, publier, modérer, suivre les signalements et les messages, sans exposer inutilement les données. |
| **Décideurs et partenaires** | Visibilité institutionnelle, cohérence avec les missions de régulation et d’information (ex. logique de type ARPTC). |

---

## 4. Périmètre fonctionnel

### 4.1 Site public (front-office)

- **Pages institutionnelles** : accueil, à propos, droits, devoirs, infractions, sanctions, bonnes pratiques, confidentialité, mentions légales, FAQ, glossaire, presse, rapports d’activité, code du numérique, etc.
- **Contenus éditoriaux** : **articles** (thématiques, pédagogie), **actualités** avec mise en avant possible (alerte, campagne).
- **Espace éducatif** : parcours type quiz (composants dédiés côté client).
- **Littératie numérique** : contenus dédiés à la compréhension des outils et des risques.
- **Signalement** : formulaire structuré (identité, type d’abus, description, pièce d’identité selon les règles métier), génération d’une **référence** et d’un **code secret** pour le suivi.
- **Suivi de signalement** : consultation de l’état du dossier avec référence + code secret ; affichage d’informations de suivi (statut, rendez-vous éventuel, consignes).
- **Contact** : formulaire de message institutionnel.
- **Newsletter** (modèle prévu côté données) : base pour l’inscription.
- **Accessibilité et SEO** : métadonnées (Open Graph, Twitter, canonical), structure de navigation, textes alternatifs et bonnes pratiques d’interface.

### 4.2 Espace d’administration et de modération (back-office)

Accès réservé aux **comptes staff** (rôles **administrateur** et **modérateur**), après authentification sécurisée.

- **Tableau de bord** : indicateurs agrégés (volumes de contenus, signalements en attente, etc.).
- **Gestion des articles et actualités** : création, édition, publication, catégories.
- **Signalements** : consultation, mise à jour de statut, notes internes, rendez-vous et messages visibles au plaignant le cas échéant.
- **Ressources téléchargeables** et **références légales** : catalogue, fichiers, métadonnées.
- **Messages du formulaire contact** : liste et traitement.
- **Sécurité du compte** : changement de mot de passe selon politique définie.
- **Journal d’audit** (selon configuration) : traçabilité des actions sensibles sur l’administration.

Les **droits diffèrent** : l’**administrateur** dispose typiquement des opérations de suppression les plus sensibles ; le **modérateur** se concentre sur la rédaction et le traitement opérationnel dans les limites fixées par les règles métier.

---

## 5. Principes directeurs

### 5.1 Institutionnel et pédagogique

- **Clarté** du langage et **progression** des contenus (du général au particulier).
- **Neutralité** et **référence aux textes** lorsque des notions juridiques sont abordées.
- **Transparence** sur le rôle du site (information, pas substitut à une procédure judiciaire ou à une plainte pénale selon les cas).

### 5.2 Données personnelles et signalements

- Collecte **minimale** et **finalisée** (contact, signalement, identité lorsque requise par le processus).
- **Séparation** entre données publiques affichées au citoyen (suivi) et données internes (notes, traitement).
- Les fichiers joints (signalement, ressources) font l’objet de **contrôles de type et de taille** ; une validation du contenu réel peut compléter le filtrage par type MIME déclaré.

### 5.3 Sécurité des accès

- Authentification **staff** par identifiants forts ; **sessions** limitées dans le temps ; protection **CSRF** sur les écritures ; **limitation de débit** sur les endpoints sensibles ; en-têtes HTTP de durcissement (Helmet, etc.).
- Les comptes de démonstration et variables d’environnement de développement **ne doivent pas** être reproduits tels quels en production.

---

## 6. Architecture technique (vue conceptuelle)

Le système est découpé en **trois couches** classiques :

1. **Client web** (React, Vite) : interface publique et interface d’administration, routage côté navigateur, appels API.
2. **API** (Node.js, Express) : authentification, exposition des ressources, validation des entrées, envoi d’e-mails selon configuration, journalisation.
3. **Persistance** (PostgreSQL, Prisma) : utilisateurs, contenus, signalements, messages, journaux, etc.

Les échanges entre client et API passent par des **chemins définis** (`/api/...`), avec possibilité de déploiement **mono-domaine** ou **API sur sous-domaine** selon le schéma d’hébergement.

---

## 7. Déploiement et exploitation

- **Environnements** : développement local (API + serveur de front), préproduction, production.
- **Base de données** : migrations versionnées ; sauvegardes et politique de rétention à définir au niveau organisationnel.
- **Build** : le front est **compilé** (`dist`) pour être servi par un serveur web ou un CDN ; l’URL de l’API et les variables publiques (`VITE_*`) sont figées au moment du build.
- **Observabilité** : points de santé et métriques basiques peuvent être exposés côté serveur pour la supervision (selon configuration).

---

## 8. Limites et évolutions possibles

### 8.1 Limites assumées

- Le portail est un **outil d’information et de signalement structuré** ; il ne remplace pas les **canaux judiciaires ou administratifs** qui relèvent d’autres autorités.
- La **qualité** du service dépend de la **disponibilité** des équipes pour traiter signalements et messages.
- La **couverture légale** et éditoriale doit être **maintenue** au fil des réformes.

### 8.2 Pistes d’évolution (non exhaustives)

- Renforcement de l’**accessibilité** (RGAA / WCAG) et du **multilingue** (Lingala et autres langues nationales).
- **Double authentification** pour les comptes administrateurs en production.
- **Politique de conservation** documentée pour les signalements et journaux.
- **Tableaux de bord** analytiques (trafic, formulaires) en respect du cadre vie privée.
- Intégration avec des **systèmes métiers** externes (ticketing, CRM) si l’institution le décide.

---

## 9. Synthèse

Le site **CINUM** matérialise une **vision cohérente** : faire du numérique un **espace de citoyenneté responsable** en RDC, en combinant **pédagogie**, **transparence institutionnelle** et **outils concrets** (signalement, contact, suivi), tout en s’appuyant sur une **architecture web moderne**, **sécurisée** et **évolutive**.

---

*Document de référence conceptuelle — à adapter selon la charte et la gouvernance de l’entité porteuse du projet.*
