# Site web ACGL (Astro + Keystatic)

Site statique pour l'Aéro-club du Grand Lyon.

## Conventions

- **Contenu du site** : en français
- **Code source** : en anglais (noms de variables, fonctions, composants, fichiers)
- **Commentaires** : à proscrire sauf si nécessaires à la compréhension du code

## Stack

- [Astro](https://astro.build/) — site statique
- [Keystatic](https://keystatic.com/) — interface d'édition locale (fichiers YAML dans le dépôt, pas de SaaS obligatoire)
- [Tailwind CSS v4](https://tailwindcss.com/) via plugin Vite

## Lancer en local

```sh
pnpm install
pnpm dev
```

Édition du contenu : ouvrir [http://127.0.0.1:4321/keystatic](http://127.0.0.1:4321/keystatic) pendant que `pnpm dev` tourne. Les changements sont enregistrés dans `src/content/` (à committer comme le reste du code).

Pour le déploiement statique (GitHub Pages), l'intégration Keystatic bascule en mode `github` en production : le CMS n'est pas exposé directement, les modifications passent par des branches préfixées `keystatic/`.

## Build

```sh
pnpm build
pnpm preview
```

## Contenu éditable

Chaque entrée est un dossier contenant un fichier de données YAML.

### Collections

| Collection | Chemin |
|---|---|
| Flotte | `src/content/fleet/<slug>/` |
| Tarifs (cotisations & instruction) | `src/content/pricing/<slug>/` |
| Conseil d'administration | `src/content/board/<slug>/` |
| Instructeurs | `src/content/instructors/<slug>/` |
| Vols découverte & offres | `src/content/offers/<slug>/` |
| Questions fréquentes | `src/content/faq/<slug>/` |
| Perfectionnements & qualifications | `src/content/ratings/<slug>/` |
| Partenaires & liens | `src/content/links/<slug>/` |

### Paramètres (singletons)

| Singleton | Chemin |
|---|---|
| Chiffres clés (page d'accueil) | `src/content/settings/home-club-numbers/` |
| Paramètres du site (contact, réseaux, carte…) | `src/content/settings/site/` |
| Nos engagements | `src/content/settings/commitments/` |
