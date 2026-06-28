import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaysChart } from './pays-chart/pays-chart';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { EntrepotStore } from '../../core/stores/entrepot.store';
import { ConfigurationStore } from '../../core/stores/configuration.store';
import { AlerteStore } from '../../core/stores/alerte.store';
import { type StatCard } from './pays-data';

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

  readonly countryName = computed(() => this.configuration()?.pays ?? "");

  readonly stats = computed<StatCard[]>(() => {
    const totalEntrepots = this.configuration()?.totalEntrepots ?? 0;
    const temp = this.configuration()?.tempIdeal ?? 0;
    const hum = this.configuration()?.humiditeIdeal ?? 0;
    const alertesCount = this.configuration()?.alertes ?? 0;

    return [
      {
        title: 'Entrepôts actifs',
        value: totalEntrepots.toLocaleString('fr-FR'),
        imagePath: '/images/entrepot.svg',
        text: 'Nombre total d’entrepôts actifs dans le pays',
        color: "violet"
      },
      {
        title: 'Temperature idéal',
        value: temp + " °C",
        imagePath: '/images/temp.svg',
        text: 'Les températures idéales pour le stockage du café dans le pays avec une tolerence de ±3°C',
        color: "blue"
      },
      {
        title: 'Humidité idéal',
        value: hum + " %",
        imagePath: '/images/hum.svg',
        text: 'Les humidités idéales pour le stockage du café dans le pays avec une tolerence de ±2%',
        color: "green"
      },
      {
        title: 'Nombre d’alertes',
        value: alertesCount.toLocaleString('fr-FR'),
        imagePath: '/images/critic.svg',
        text: 'Alertes actives nécessitant une attention',
        color: "red"
      }
    ] satisfies StatCard[];
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
