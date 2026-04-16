import { Injectable, inject, signal } from '@angular/core';
import { MesureDto } from '../../shared/models/api/models';
import { MesureService } from '../services/mesure.service';

@Injectable({
  providedIn: 'root'
})
export class MesureStore {
  private readonly mesureService = inject(MesureService);
  // États pour les données
  private readonly _mesures = signal<MesureDto[]>([]);

  // États de chargement
  private readonly _loading = signal(false);

  // États d'erreur
  private readonly _error = signal<string | null>(null);

  // État du pays sélectionné
  private readonly _selectedCountryCode = signal<string | null>(null);

  // Getters pour les signaux
  readonly mesures = this._mesures.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedCountryCode = this._selectedCountryCode.asReadonly();

  // Computed signals pour les données filtrées
  // Mesures n'ont pas de codePays, donc pas de filtrage

  // Méthodes pour charger les données
  loadMesuresByLot(countryCode: string, lotId: number): void {
    this.setLoading(true);
    this.setError(null);
    this.mesureService.getMesuresByLot(countryCode, lotId).subscribe({
      next: (response) => {
        this.setMesures(response.mesures);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement des mesures');
        this.setLoading(false);
      }
    });
  }

  // Méthodes pour mettre à jour l'état
  setMesures(mesures: MesureDto[]): void {
    this._mesures.set(mesures);
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
    this._mesures.set([]);
    this.clearError();
  }
}