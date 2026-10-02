# Site web ACGL (Astro + Keystatic)

Site de l'Aéroclub du Grand Lyon, en ligne sur [www.acgl.fr](https://www.acgl.fr) et hébergé sur [Vercel](https://vercel.com/).

## Conventions

- **Contenu du site** : en français
- **Code source** : en anglais (noms de variables, fonctions, composants, fichiers)
- **Commentaires** : à proscrire sauf si nécessaires à la compréhension du code

## Stack

- [Astro](https://astro.build/) avec l'adaptateur [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/) : pages statiques, fonctions serverless pour le formulaire de contact (Astro Actions) et l'interface Keystatic
- [Keystatic](https://keystatic.com/) : édition du contenu (fichiers YAML dans le dépôt)
- [Tailwind CSS v4](https://tailwindcss.com/) via plugin Vite
- [Brevo](https://www.brevo.com/) : envoi des emails du formulaire de contact
- [Vercel Analytics](https://vercel.com/analytics)

Prérequis : Node.js 24 et pnpm.

## Lancer en local

```sh
cp .env.example .env   # puis renseigner les variables nécessaires
pnpm install
pnpm dev
```

Édition du contenu : ouvrir [http://127.0.0.1:4321/keystatic](http://127.0.0.1:4321/keystatic) pendant que `pnpm dev` tourne. En local, Keystatic écrit directement dans `src/content/` (à committer comme le reste du code).

## Déploiement (Vercel)

Le dépôt GitHub est relié à Vercel : chaque push sur `main` déploie la production, les autres branches et les pull requests obtiennent une URL de preview.

En production, Keystatic passe en mode `github` (voir `keystatic.config.ts`) : les modifications faites sur [www.acgl.fr/keystatic](https://www.acgl.fr/keystatic) sont enregistrées dans le dépôt GitHub `Aeroclub-du-Grand-Lyon/acgl-website` sur des branches préfixées `keystatic/`, puis fusionnées dans `main` pour être mises en ligne.

### Variables d'environnement

À définir dans `.env` en local et dans les paramètres du projet Vercel en production (modèle dans `.env.example`) :

| Variable | Rôle |
|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub App utilisée par Keystatic en production |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Secret de la GitHub App |
| `KEYSTATIC_SECRET` | Secret de session Keystatic |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Slug de la GitHub App |
| `BREVO_API_KEY` | Clé API Brevo pour le formulaire de contact |

## Scripts

### Scripts pnpm

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement sur [http://127.0.0.1:4321](http://127.0.0.1:4321) |
| `pnpm build` | Build de production (sortie dans `dist/` et `.vercel/output/`) |
| `pnpm preview` | Prévisualise le dernier build en local |
| `pnpm astro …` | Accès direct à la CLI Astro (ex. `pnpm astro check`) |

### Scripts utilitaires (`scripts/`)

#### `generate-favicons.mjs` : logos et favicons

```sh
node scripts/generate-favicons.mjs
```

À lancer après chaque modification des logos dans `design/logo/`. Le script :

- copie `design/logo/cercle/logo-cercle.svg` vers `public/logo-square.svg` (header, footer, favicon SVG) ;
- génère `public/logo-vertical.svg` à partir de `design/logo/vertical/logo-vertical.svg`, avec le texte en blanc pour les fonds sombres ;
- génère `public/logo-square.png`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` et les icônes Android déclarées dans `site.webmanifest`.

L'image de partage `public/images/og-image.jpg` contient aussi le logo, mais elle n'est pas générée par le script : il faut la mettre à jour à la main.

#### `check-redirects.mjs` : vérification des redirections

```sh
node scripts/check-redirects.mjs https://<url-de-preview>.vercel.app
```

Vérifie un déploiement (preview ou production) :

- chaque ancienne URL WordPress déclarée dans `redirects.mjs` (avec et sans `/` final) doit rediriger vers la bonne page et finir en 200 ;
- chaque page du sitemap doit répondre 200 directement, sans redirection.

Le script se termine avec un code d'erreur s'il y a au moins un échec. À lancer avant chaque mise en production qui touche aux URLs ou à `redirects.mjs`.

## Contenu éditable

Le contenu est stocké en YAML dans `src/content/` et s'édite via Keystatic.

### Collections

Une entrée = un fichier `<slug>.yaml`.

| Collection | Chemin |
|---|---|
| Flotte | `src/content/fleet/` |
| Tarifs (cotisations & instruction) | `src/content/pricing/` |
| Conseil d'administration | `src/content/board/` |
| Instructeurs | `src/content/instructors/` |
| Vols découverte & offres | `src/content/offers/` |
| Questions fréquentes | `src/content/faq/` |
| Perfectionnements & qualifications | `src/content/ratings/` |
| Partenaires & liens | `src/content/links/` |

### Paramètres (singletons)

| Singleton | Fichier |
|---|---|
| Accueil (chiffres clés) | `src/content/settings/home-club-numbers.yaml` |
| Coordonnées | `src/content/settings/contact.yaml` |
| Réseaux sociaux | `src/content/settings/social-links.yaml` |
| Détails des tarifs | `src/content/settings/pricing-details.yaml` |
| Vie du club | `src/content/settings/club-events.yaml` |
| Engagements | `src/content/settings/commitments.yaml` |
| Galerie du club | `src/content/settings/club-gallery.yaml` |
