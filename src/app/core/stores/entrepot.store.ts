import { Injectable, inject, signal, computed } from '@angular/core';
import {EntrepotDto, EntrepotONEResponse} from '../../shared/models/api/models';
import { EntrepotService } from '../services/entrepot.service';

@Injectable({
  providedIn: 'root'
})
export class EntrepotStore {
  private readonly entrepotService = inject(EntrepotService);
  // États pour les données
  private readonly _entrepots = signal<EntrepotDto[]>([]);

  private readonly _entrepot = signal<EntrepotONEResponse | null>(null);

  // États de chargement
  private readonly _loading = signal(false);

  // États d'erreur
  private readonly _error = signal<string | null>(null);

  // État du pays sélectionné
  private readonly _selectedCountryCode = signal<string | null>(null);

  // Getters pour les signaux
  readonly entrepots = this._entrepots.asReadonly();
  readonly entrepot = this._entrepot.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedCountryCode = this._selectedCountryCode.asReadonly();

  // Computed signals pour les données filtrées
  readonly entrepotsByCountry = computed(() => {
    const countryCode = this._selectedCountryCode();
    return countryCode
      ? this._entrepots().filter(entrepot => this.normalizeCountryCode(entrepot.codePays) === this.normalizeCountryCode(countryCode))
      : this._entrepots();
  });

  // Méthodes pour charger les données
  loadEntrepots(countryCode: string): void {
    this.setLoading(true);
    this.setError(null);
    this.entrepotService.getAllEntrepots(countryCode).subscribe({
      next: (response) => {
        this.setEntrepots(response.entrepots);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement des entrepôts');
        this.setLoading(false);
      }
    });
  }

  loadEntrepotById(countryCode: string, id: number): void {
    this.setLoading(true);
    this.setError(null);
    this.entrepotService.getEntrepotById(countryCode, id).subscribe({
      next: (entrepot) => {
        console.log(entrepot);
        
        // Pour un seul entrepôt, on peut l'ajouter ou remplacer la liste
        this.setEntrepot(entrepot);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement de l\'entrepôt');
        this.setLoading(false);
      }
    });
  }

  loadAllEntrepots(): void {
    this.setLoading(true);
    this.setError(null);
    this.entrepotService.getAllEntrepotsAllPays().subscribe({
      next: (entrepots) => {
        this.setEntrepots(entrepots);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement de tous les entrepôts');
        this.setLoading(false);
      }
    });
  }

  // Méthodes pour mettre à jour l'état
  setEntrepots(entrepots: EntrepotDto[]): void {
    this._entrepots.set(entrepots);
  }

  setEntrepot(entrepot: EntrepotONEResponse): void {
    this._entrepot.set(entrepot);
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
    this._entrepots.set([]);
    this.clearError();
  }

  private normalizeCountryCode(code: string | null): string {
    if (!code) return '';
    const upper = code.toUpperCase();
    switch (upper) {
      case 'BR':
      case 'BRA':
        return 'BR';
      case 'EC':
      case 'ECU':
        return 'EC';
      case 'CO':
      case 'COL':
        return 'CO';
      default:
        return upper;
    }
  }
}
