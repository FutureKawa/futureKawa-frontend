import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlerteStore } from '../../../core/stores/alerte.store';
import { EntrepotStore } from '../../../core/stores/entrepot.store';
import { LotStore } from '../../../core/stores/lot.store';
import { ConfigurationStore } from '../../../core/stores/configuration.store';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-loader">
      <h3>Chargement des données pour {{ selectedCountryCode() }}</h3>

      @if (alerteStore.loading()) {
        <p>Chargement des alertes...</p>
      } @else if (alerteStore.error()) {
        <p class="error">Erreur alertes: {{ alerteStore.error() }}</p>
      } @else {
        <p>Alertes chargées: {{ alerteStore.alertes().length }}</p>
      }

      @if (entrepotStore.loading()) {
        <p>Chargement des entrepôts...</p>
      } @else if (entrepotStore.error()) {
        <p class="error">Erreur entrepôts: {{ entrepotStore.error() }}</p>
      } @else {
        <p>Entrepôts chargés: {{ entrepotStore.entrepots().length }}</p>
      }

      @if (lotStore.loading()) {
        <p>Chargement des lots...</p>
      } @else if (lotStore.error()) {
        <p class="error">Erreur lots: {{ lotStore.error() }}</p>
      } @else {
        <p>Lots chargés: {{ lotStore.lots().length }}</p>
      }

      @if (configurationStore.loading()) {
        <p>Chargement de la configuration...</p>
      } @else if (configurationStore.error()) {
        <p class="error">Erreur configuration: {{ configurationStore.error() }}</p>
      } @else if (configurationStore.configuration()) {
        <p>Configuration chargée pour {{ configurationStore.configuration()?.pays }}</p>
      }
    </div>
  `,
  styles: [`
    .data-loader {
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      margin: 1rem 0;
    }
    .error {
      color: #dc2626;
    }
  `]
})
export class DataLoaderComponent implements OnInit {
  readonly alerteStore = inject(AlerteStore);
  readonly entrepotStore = inject(EntrepotStore);
  readonly lotStore = inject(LotStore);
  readonly configurationStore = inject(ConfigurationStore);

  selectedCountryCode = signal<string | null>(null);

  ngOnInit() {
    this.loadDataForCountry();
  }

  private loadDataForCountry() {
    const countryCode = this.selectedCountryCode();
    if (!countryCode) return;

    // Set selected country on all stores
    this.alerteStore.setSelectedCountryCode(countryCode);
    this.entrepotStore.setSelectedCountryCode(countryCode);
    this.lotStore.setSelectedCountryCode(countryCode);

    // Charger les données via les stores
    this.alerteStore.loadAlertes(countryCode);
    this.entrepotStore.loadEntrepots(countryCode);
    this.lotStore.loadLots(countryCode);
    this.configurationStore.loadConfiguration(countryCode);
  }
}