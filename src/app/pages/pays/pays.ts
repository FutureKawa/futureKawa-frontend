import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaysChart } from './pays-chart/pays-chart';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { EntrepotStore } from '../../core/stores/entrepot.store';
import { ConfigurationStore } from '../../core/stores/configuration.store';
import { AlerteStore } from '../../core/stores/alerte.store';
import { getCountryByCode, type StatCard } from './pays-data';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [PaysChart, StatCardComponent],
  templateUrl: './pays.html',
  styleUrl: './pays.scss'
})
export class PaysComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly entrepotStore = inject(EntrepotStore);
  private readonly configurationStore = inject(ConfigurationStore);
  private readonly alerteStore = inject(AlerteStore);

  readonly selectedCountryCode = signal<string | null>(null);
  readonly entrepots = this.entrepotStore.entrepotsByCountry;
  readonly configuration = this.configurationStore.configuration;

  readonly countryName = computed(() => {
    const currentConfiguration = this.configuration();
    if (currentConfiguration) {
      return currentConfiguration.pays;
    }

    const currentCode = this.selectedCountryCode();

    return getCountryByCode(currentCode?.toLowerCase() ?? null)?.name ?? 'Pays';
  });

  readonly stats = computed<StatCard[]>(() => {
    const currentEntrepots = this.entrepots();
    const totalEntrepots = currentEntrepots.length;
    const totalLots = currentEntrepots.reduce((sum, entrepot) => sum + entrepot.nombreLots, 0);
    const alertesByCountry = this.alerteStore.alertesNonTraiteesByCountry();
    const alertesCount = alertesByCountry.length;

    return [
      {
        title: 'Entrepôts actifs',
        value: totalEntrepots.toLocaleString('fr-FR'),
        icon: '/images/entrepot.svg',
        percent: '0%',
        trend: 'up'
      },
      {
        title: 'Nombre total de lots',
        value: totalLots.toLocaleString('fr-FR'),
        icon: '/images/totallot.svg',
        percent: '0%',
        trend: 'up'
      },
      {
        title: 'Stock total',
        value: '-',
        icon: '/images/totalstock.svg',
        percent: '0%',
        trend: 'up'
      },
      {
        title: 'Alertes critiques',
        value: alertesCount.toLocaleString('fr-FR'),
        icon: '/images/critic.svg',
        percent: '0%',
        trend: 'up'
      }
    ];
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const routeCode = params.get('code')?.trim() ?? null;
      console.log(routeCode);
      
      const normalizedCode = this.toApiCountryCode(routeCode);

      this.selectedCountryCode.set(normalizedCode);
      this.entrepotStore.setSelectedCountryCode(normalizedCode);
      this.alerteStore.setSelectedCountryCode(normalizedCode);

      if (normalizedCode) {
        this.entrepotStore.loadEntrepots(normalizedCode);
        this.configurationStore.loadConfiguration(normalizedCode);
        return;
      }

      this.entrepotStore.loadAllEntrepots();
      this.configurationStore.resetData();
    });

    // Log whenever the entrepôts list changes
    effect(() => {
      const list = this.entrepots();
      if (list?.length) {
        console.log('Entrepôts chargés pour', this.selectedCountryCode(), list);
      }
    });
  }

  private toApiCountryCode(code: string | null): string | null {
    if (!code) {
      return null;
    }

    const up = code.toUpperCase().trim();

    // Normalize to 2-letter API codes
    if (['ECU', 'ECUADOR', 'EC'].includes(up)) {
      return 'EC';
    }

    if (['BRA', 'BR', 'BRASIL'].includes(up)) {
      return 'BR';
    }

    if (['COL', 'CO', 'COLOMBIA'].includes(up)) {
      return 'CO';
    }

    return up;
  }
}