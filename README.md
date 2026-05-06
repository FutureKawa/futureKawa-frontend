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
│  welcome / dashboard / pays / entrepot / lots
├────────────────────────────────────────────┤
│          Shared Components                 │
│     navbar / sidebar / stat-card           │
├────────────────────────────────────────────┤
│              Styles SCSS                   │
│   styles globaux + styles par composant    │
└────────────────────────────────────────────┘
```

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
│  welcome / dashboard / pays / entrepot / lots
├────────────────────────────────────────────┤
│          Shared Components                 │
│     navbar / sidebar / stat-card           │
├────────────────────────────────────────────┤
│              Core Layer                    │
│   Services API + State Management (Stores) │
├────────────────────────────────────────────┤
│              Styles SCSS                   │
│   styles globaux + styles par composant    │
└────────────────────────────────────────────┘
```

L’application repose sur une architecture **standalone Angular** avec séparation claire des responsabilités :

- **Pages** : Composants de présentation pour chaque route
- **Shared Components** : Composants UI réutilisables
- **Core Layer** : Logique métier et gestion d'état
  - **Services** : Appels API HTTP
  - **Stores** : Gestion d'état réactive avec Signals

---

## 📁 Structure du projet

```text
futurekawa-frontend/
├── public/                     # Fichiers statiques et assets publics
└── src/                        # Code source de l'application
    └── app/                    # Cœur de l'application Angular
        │
        ├── core/               # Logique métier et gestion d'état (Core Layer)
        │   ├── services/       # Services API (HTTP calls)
        │   │   ├── alerte.service.ts
        │   │   ├── configuration.service.ts
        │   │   ├── entrepot.service.ts
        │   │   ├── lot.service.ts
        │   │   └── mesure.service.ts
        │   └── stores/         # State management (Signals)
        │       ├── alerte.store.ts
        │       ├── configuration.store.ts
        │       ├── entrepot.store.ts
        │       ├── lot.store.ts
        │       └── mesure.store.ts
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
        │   ├── pays/
        │   └── welcome/
        │
        └── shared/             # Utilitaires partagés
            ├── components/     # Composants partagés additionnels
            └── index.ts        # Exports centralisés
```

---

## 🏪 State Management (Stores)

L'application utilise des **stores individuels** pour chaque entité métier, basés sur les **Signals Angular** pour une gestion d'état réactive.

### Stores disponibles

| Store | Description | Méthodes principales |
|-------|-------------|---------------------|
| `AlerteStore` | Gestion des alertes | `loadAlertes()`, `loadAlertesByLot()`, `loadAllAlertes()` |
| `EntrepotStore` | Gestion des entrepôts | `loadEntrepots()`, `loadEntrepotById()`, `loadAllEntrepots()` |
| `LotStore` | Gestion des lots | `loadLots()`, `loadLotByFunctionalId()`, `loadLotsByEntrepot()` |
| `MesureStore` | Gestion des mesures | `loadMesuresByLot()` |
| `ConfigurationStore` | Configuration globale | `loadConfiguration()` |

### Utilisation dans un composant

```typescript
import { inject } from '@angular/core';
import { AlerteStore } from '../core/stores/alerte.store';

@Component({...})
export class MyComponent {
  private alerteStore = inject(AlerteStore);

  // Accès aux données réactives
  alertes = this.alerteStore.alertes;
  loading = this.alerteStore.loading;
  error = this.alerteStore.error;

  // Chargement des données
  loadData(countryCode: string) {
    this.alerteStore.setSelectedCountryCode(countryCode);
    this.alerteStore.loadAlertes(countryCode);
  }
}
```

### Avantages de cette architecture

- ✅ **Séparation claire** : Chaque store gère une seule entité
- ✅ **Réactivité** : Utilisation des Signals pour les mises à jour automatiques
- ✅ **Encapsulation** : Les stores contiennent la logique de chargement
- ✅ **Filtrage intégré** : Computed signals pour le filtrage par pays
- ✅ **Gestion d'erreurs** : États d'erreur par store

---

Le routage est centralisé dans `app.routes.ts`.

| Route        | Page associée | Description |
|--------------|---------------|-------------|
| `/`          | redirection   | Redirige vers la page d’accueil |
| `/welcome`   | Welcome       | Page d’accueil / introduction |
| `/dashboard` | Dashboard     | Tableau de bord principal |
| `/pays/:code`       | Pays           | Affiche une vue liée à un pays via un paramètre d’URL |
| `/entrepot`  | Entrepot      | Liste ou vue des entrepôts |
| `/lots`      | Lots          | Liste ou vue des lots |

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

if you need icon check this : https://heroicons.com/

---
## [🚀 Lancement du projet](./angular.md)

---

## 📝 Licence

Projet réalisé dans le cadre de la **MSPR - Bloc 4** (EPSI/EISI 2026).

---

*Made with ☕ and ❤️ by FutureKawa Team*
