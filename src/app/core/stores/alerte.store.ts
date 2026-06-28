import { Injectable, inject, signal, computed } from '@angular/core';
import { AlerteDto } from '../../shared/models/api/models';
import { AlerteService } from '../services/alerte.service';

@Injectable({
  providedIn: 'root'
})
export class AlerteStore {
  private readonly alerteService = inject(AlerteService);

  // États pour les données
  private readonly _alertes = signal<AlerteDto[]>([]);

  // États de chargement
  private readonly _loading = signal(false);

  // États d'erreur
  private readonly _error = signal<string | null>(null);

  // État du pays sélectionné
  private readonly _selectedCountryCode = signal<string | null>(null);

  // Getters pour les signaux
  readonly alertes = this._alertes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedCountryCode = this._selectedCountryCode.asReadonly();

  // Computed signals pour les données filtrées
  readonly alertesByCountry = computed(() => {
    const countryCode = this._selectedCountryCode();
    return countryCode
      ? this._alertes().filter(alerte => alerte.codePays === countryCode)
      : this._alertes();
  });

  readonly alertesNonTraitees = computed(() =>
    this._alertes().filter(alerte => !alerte.traitee)
  );

  readonly alertesNonTraiteesByCountry = computed(() => {
    const countryCode = this._selectedCountryCode();
    return countryCode
      ? this.alertesNonTraitees().filter(alerte => alerte.codePays === countryCode)
      : this.alertesNonTraitees();
  });

  // Méthodes pour charger les données
  loadAlertes(countryCode: string): void {
    this.setLoading(true);
    this.setError(null);
    this.alerteService.getAllAlertes(countryCode).subscribe({
      next: (response) => {
        this.setAlertes(response.alertes);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement des alertes');
        this.setLoading(false);
      }
    });
  }

  loadAlertesByLot(countryCode: string, lotId: number): void {
    this.setLoading(true);
    this.setError(null);
    this.alerteService.getAlertesByLot(countryCode, lotId).subscribe({
      next: (response) => {
        this.setAlertes(response.alertes);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement des alertes du lot');
        this.setLoading(false);
      }
    });
  }

  loadAllAlertes(): void {
    this.setLoading(true);
    this.setError(null);
    this.alerteService.getAllAlertesAllPays().subscribe({
      next: (alertes) => {
        console.log(alertes);
        
        this.setAlertes(alertes);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement de toutes les alertes');
        this.setLoading(false);
      }
    });
  }

  // Méthodes pour mettre à jour l'état
  setAlertes(alertes: AlerteDto[]): void {
    this._alertes.set(alertes);
  }

  setSelectedCountryCode(code: string | null): void {
    this._selectedCountryCode.set(code);
  }

  // Méthodes pour gérer le chargement
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  // Méthodes pour gérer les erreurs
  setError(error: string | null): void {
    this._error.set(error);
  }

  // Méthodes utilitaires
  clearError(): void {
    this._error.set(null);
  }

  resetData(): void {
    this._alertes.set([]);
    this.clearError();
  }
}