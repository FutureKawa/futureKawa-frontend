# ☕ FutureKawa - Frontend Web

> **Frontend web pour la visualisation et la gestion des données FutureKawa**
> *Application Angular standalone avec dashboard, navigation par pages et composants réutilisables*

---

## 📋 Table des matières

- [☕ FutureKawa - Frontend Web](#-futurekawa---frontend-web)
  - [📋 Table des matières](#-table-des-matières)
  - [🌍 Aperçu](#-aperçu)
  - [🏗️ Architecture](#️-architecture)
    - [Architecture frontend](#architecture-frontend)
  - [📁 Structure du projet](#-structure-du-projet)
  - [🧭 Navigation](#-navigation)
  - [🧩 Composants UI](#-composants-ui)
  - [🚀 Lancement du projet](#-lancement-du-projet)
  - [🛠️ Build](#️-build)
  - [📝 Licence](#-licence)

---

## 🌍 Aperçu

Le **frontend FutureKawa** est une application web Angular permettant de :

- 📊 **Afficher un dashboard** avec cartes de statistiques et vues principales
- 🌍 **Naviguer entre plusieurs pages métier**
- 🏭 **Consulter les entrepôts**
- 📦 **Consulter les lots**
- 💳 **Accéder à une page de paiement**
- 🧭 **Utiliser une navigation claire** avec sidebar et navbar
- ♻️ **Réutiliser des composants UI** pour garder un projet propre et maintenable

---

## 🏗️ Architecture

### Architecture frontend

```text
┌────────────────────────────────────────────┐
│           App Root (app.ts)                │
│      Layout global + RouterOutlet          │
├────────────────────────────────────────────┤
│           Routing (app.routes.ts)          │
│      Navigation entre les pages            │
├────────────────────────────────────────────┤
│                Pages                       │
│  welcome / dashboard / pay / entrepot / lots
├────────────────────────────────────────────┤
│          Shared Components                 │
│     navbar / sidebar / stat-card           │
├────────────────────────────────────────────┤
│              Styles SCSS                   │
│   styles globaux + styles par composant    │
└────────────────────────────────────────────┘
```

L’application repose sur une architecture **standalone Angular**, avec un découpage simple entre les pages métier et les composants réutilisables.

---

## 📁 Structure du projet

```text
futurekawa-frontend/
├── public/                     # Fichiers statiques et assets publics
└── src/                        # Code source de l'application
    └── app/                    # Cœur de l'application Angular
        │
        ├── components/         # Composants UI réutilisables (Shared)
        │   ├── navbar/
        │   ├── sidebar/
        │   └── stat-card/
        │
        ├── models/             # Interfaces et classes métiers (DTOs)
        │
        ├── pages/              # Pages principales (Features)
        │   ├── dashboard/
        │   ├── entrepot/
        │   ├── lots/
        │   ├── pay/
        │   └── welcome/
        │
        └── services/           # Logique métier et appels API HTTP (Core)
```

---

## 🧭 Navigation

Le routage est centralisé dans `app.routes.ts`.

### Routes principales

| Route        | Page associée | Description |
|--------------|---------------|-------------|
| `/`          | redirection   | Redirige vers la page d’accueil |
| `/welcome`   | Welcome       | Page d’accueil / introduction |
| `/dashboard` | Dashboard     | Tableau de bord principal |
| `/pay`       | Pay           | Page de paiement |
| `/entrepot`  | Entrepot      | Liste ou vue des entrepôts |
| `/lots`      | Lots          | Liste ou vue des lots |

### Exemple de route dynamique

Si activée dans le projet, une route dynamique peut aussi être utilisée :

| Route         | Description |
|---------------|-------------|
| `/pays/:code` | Affiche une vue liée à un pays via un paramètre d’URL |

---

## 🧩 Composants UI

### `navbar`

Composant d’en-tête contenant :
- barre de recherche
- notifications
- langue
- profil utilisateur

### `sidebar`

Composant de navigation latérale contenant :
- accès au dashboard
- accès aux pages métier
- logo FutureKawa
- mode réduit / plié
- navigation principale de l’application

### `stat-card`

Composant réutilisable pour afficher :
- un titre
- une valeur
- une icône
- éventuellement une tendance ou un texte complémentaire

---
## [🚀 Lancement du projet](./angular.md)

---

## 📝 Licence

Projet réalisé dans le cadre de la **MSPR - Bloc 4** (EPSI/EISI 2026).

---

*Made with ☕ and ❤️ by FutureKawa Team*
