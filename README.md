# BNEVO — Front React

Interface React autonome de BNEVO, prévue pour fonctionner sans le serveur Express du dossier `REACT/` et pour être raccordée plus tard à l’API Symfony.

## Prérequis

- Node.js 20.19+ ou 22.12+
- npm

## Démarrage

```bash
npm install
npm run dev
```

Vite affiche l’adresse locale dans le terminal. Les routes de l’application (`/organisation`, `/benevole`, etc.) sont servies par le fallback SPA de Vite en développement et en prévisualisation.

## Commandes

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance Vite en mode développement |
| `npm run build` | Génère le site statique dans `dist/` |
| `npm run preview` | Prévisualise le build local |
| `npm run lint` | Vérifie les types TypeScript |
| `npm run clean` | Supprime `dist/` |

## Données et backend

Cette version est **front-only** : elle n’inclut ni Express, ni SSR, ni routes API. Les données de démonstration sont fournies par `src/data/mockData.ts`, puis lues et enregistrées dans `localStorage` par `src/services/appDataService.ts`. Les identifiants de connexion sont simulés; aucune authentification réelle n’est effectuée.

Les routes des espaces Organisation et Bénévole vérifient la session de démonstration et son rôle avant d’afficher leur contenu. Cette protection est uniquement côté navigateur et peut être contournée : Symfony devra appliquer les véritables contrôles d’authentification et d’autorisation côté serveur.

Le jeu de données initial contient deux missions et le compte bénévole de démonstration s’appelle « Valentin A ». Les missions de démonstration retirées sont filtrées des données déjà sauvegardées dans `localStorage`.

Le service de données forme le point de séparation avec l’interface. Quand l’API Symfony sera définie, son contrat (routes, formats JSON, authentification et erreurs) devra être confirmé avant de remplacer l’adaptateur local par des appels HTTP. Les échanges d’équipe de démonstration restent également stockés dans le navigateur.

Les photos de profil sont simulées côté navigateur : les images sélectionnées sont redimensionnées, puis conservées dans `localStorage`. À l’intégration Symfony, ce flux devra être remplacé par l’envoi de fichier prévu par l’API et relié au champ `profileImagePath` du modèle utilisateur. Le compte Valentin démarre sans photo.

Pour déployer le build sur un hébergement statique, configurer le serveur pour renvoyer `index.html` sur les routes de l’application, tout en laissant les fichiers de `dist/assets/` et `dist/images/` accessibles.

## Structure

```text
index.html
public/images/               Images servies telles quelles par Vite
src/
  components/common/          Contrôles de profil et avatar réutilisables
  components/organisation/    Composants d’organisation, dont le calendrier
  context/AppContext.tsx      État partagé et composition des actions
  data/mockData.ts            Données de démonstration
  hooks/useMissionActions.ts  Actions métier des missions
  pages/                      Pages bénévoles et organisations
  services/appDataService.ts  Adaptateur de persistance local
  utils/profileImage.ts       Validation et préparation des photos
```
