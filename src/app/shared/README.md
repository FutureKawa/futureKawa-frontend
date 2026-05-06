# API Integration

Ce document décrit l'intégration de l'API backend avec le frontend Angular.

## Architecture

### Modèles (DTO)
Les modèles TypeScript sont définis dans `src/app/shared/models/api/models.ts` et correspondent aux DTO Java du backend.

### Services
Chaque entité a son propre service pour les appels API :
- `AlerteService` - Gestion des alertes
- `ConfigurationService` - Configuration par pays
- `EntrepotService` - Gestion des entrepôts
- `LotService` - Gestion des lots
- `MesureService` - Mesures des lots

### Store (État global)
Le `AppStore` utilise des signaux Angular pour gérer l'état global de l'application :
- Données (alertes, entrepôts, lots, mesures, configuration)
- États de chargement
- Gestion des erreurs
- Pays sélectionné

## Utilisation

### Injection du store
```typescript
import { AppStore } from '../shared/store/app.store';

@Component({...})
export class MyComponent {
  readonly store = inject(AppStore);

  // Accès aux données
  alertes = this.store.alertes;
  loading = this.store.loadingAlertes;
  error = this.store.errorAlertes;

  // Données filtrées par pays
  alertesFiltrees = this.store.alertesByCountry;
}
```

### Utilisation des services
```typescript
import { AlerteService } from '../shared/services/alerte.service';

@Component({...})
export class MyComponent {
  private alerteService = inject(AlerteService);

  loadAlertes() {
    const countryCode = 'BR'; // ou this.store.selectedCountryCode()
    this.alerteService.getAllAlertes(countryCode).subscribe({
      next: (response) => {
        // Traitement des données
        console.log(response.alertes);
      },
      error: (error) => {
        // Gestion d'erreur
        console.error(error);
      }
    });
  }
}
```

### Chargement des données avec le store
```typescript
import { DataLoaderComponent } from '../shared/components/data-loader/data-loader.component';

@Component({
  template: `
    <app-data-loader></app-data-loader>
    <!-- Vos composants utilisent automatiquement les données du store -->
  `,
  imports: [DataLoaderComponent]
})
export class DashboardComponent {
  readonly store = inject(AppStore);

  // Les données sont automatiquement disponibles
  alertes = this.store.alertes;
  entrepots = this.store.entrepots;
}
```

## Endpoints API

### Alertes
- `GET /{codePays}/alertes` - Toutes les alertes d'un pays
- `GET /{codePays}/alertes/lot/{lotId}` - Alertes d'un lot spécifique
- `GET /alertes/all` - Toutes les alertes de tous les pays

### Configuration
- `GET /{codePays}/configuration` - Configuration d'un pays

### Entrepôts
- `GET /{codePays}/entrepots` - Tous les entrepôts d'un pays
- `GET /{codePays}/entrepots/{id}` - Entrepôt spécifique
- `GET /entrepots/all` - Tous les entrepôts de tous les pays

### Lots
- `GET /{codePays}/lots` - Tous les lots d'un pays
- `GET /{codePays}/lots/search?lotId={id}` - Lot par ID fonctionnel
- `GET /{codePays}/lots/entrepot/{entrepotId}` - Lots d'un entrepôt
- `GET /lots/all` - Tous les lots de tous les pays

### Mesures
- `GET /{codePays}/mesures/lot/{lotId}` - Mesures d'un lot

## Gestion d'état

Le store fournit des signaux computed pour les données filtrées :
- `alertesByCountry` - Alertes du pays sélectionné
- `entrepotsByCountry` - Entrepôts du pays sélectionné
- `lotsByCountry` - Lots du pays sélectionné
- `alertesNonTraitees` - Alertes non traitées
- `alertesNonTraiteesByCountry` - Alertes non traitées du pays sélectionné

## Configuration

L'URL de l'API est configurée dans `src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```