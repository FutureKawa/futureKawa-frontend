import { Injectable, inject, signal } from '@angular/core';
import { ConfigurationResponse } from '../../shared/models/api/models';
import { ConfigurationService } from '../services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationStore {
  private readonly configurationService = inject(ConfigurationService);
  // États pour les données
  private readonly _configuration = signal<ConfigurationResponse | null>(null);

  // États de chargement
  private readonly _loading = signal(false);

  // États d'erreur
  private readonly _error = signal<string | null>(null);

  // Getters pour les signaux
  readonly configuration = this._configuration.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Méthodes pour charger les données
  loadConfiguration(countryCode: string): void {
    this.setLoading(true);
    this.setError(null);
    this.configurationService.getConfiguration(countryCode).subscribe({
      next: (configuration) => {
        this.setConfiguration(configuration);
        this.setLoading(false);
      },
      error: (error) => {
        this.setError(error.message || 'Erreur lors du chargement de la configuration');
        this.setLoading(false);
      }
    });
  }

  // Méthodes pour mettre à jour l'état
  setConfiguration(configuration: ConfigurationResponse): void {
    this._configuration.set(configuration);
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
    this._configuration.set(null);
    this.clearError();
  }
}