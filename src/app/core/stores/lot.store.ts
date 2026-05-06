import { Injectable, inject, signal, computed } from '@angular/core';
import { LotDto } from '../../shared/models/api/models';
import { LotService } from '../services/lot.service';

@Injectable({
  providedIn: 'root'
})
export class LotStore {
  private readonly lotService = inject(LotService);
  // États pour les données
  private readonly _lots = signal<LotDto[]>([]);

  // États de chargement
  private readonly _loading = signal(false);

  // États d'erreur
  private readonly _error = signal<string | null>(null);

  // État du pays sélectionné
  private readonly _selectedCountryCode = signal<string | null>(null);

  // Getters pour les signaux
  readonly lots = this._lots.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedCountryCode = this._selectedCountryCode.asReadonly();

  // Computed signals pour les données filtrées
  readonly lotsByCountry = computed(() => {
    const countryCode = this._selectedCountryCode();
    return countryCode
      ? this._lots().filter(lot => lot.codePays === countryCode)
      : this._lots();
  });

  // Méthodes pour charger les données
  loadLots(countryCode: string): void {
    this.setLoading(true);
    this.setError(null);
    this.lotService.getAllLots(countryCode).subscribe({
      next: (response) => {
        this.setLots(response.lots);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement des lots');
        this.setLoading(false);
      }
    });
  }

  loadLotByFunctionalId(countryCode: string, lotId: string): void {
    this.setLoading(true);
    this.setError(null);
    this.lotService.getLotByFunctionalId(countryCode, lotId).subscribe({
      next: (lot) => {
        this.setLots([lot]);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement du lot');
        this.setLoading(false);
      }
    });
  }

  loadLotsByEntrepot(countryCode: string, entrepotId: number): void {
    this.setLoading(true);
    this.setError(null);
    this.lotService.getLotsByEntrepot(countryCode, entrepotId).subscribe({
      next: (response) => {
        this.setLots(response.lots);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement des lots de l\'entrepôt');
        this.setLoading(false);
      }
    });
  }

  loadAllLots(): void {
    this.setLoading(true);
    this.setError(null);
    this.lotService.getAllLotsAllPays().subscribe({
      next: (lots) => {
        this.setLots(lots);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement de tous les lots');
        this.setLoading(false);
      }
    });
  }

  // Méthodes pour mettre à jour l'état
  setLots(lots: LotDto[]): void {
    this._lots.set(lots);
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
    this._lots.set([]);
    this.clearError();
  }
}