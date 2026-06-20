import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { StatCardComponent } from '../../../components/stat-card/stat-card';
import { EntrepotStore } from '../../../core/stores/entrepot.store';
import { LotStore } from '../../../core/stores/lot.store';
import type { StatCard } from '../../pays/pays-data';

@Component({
  selector: 'app-entrepot',
  standalone: true,
  imports: [DatePipe, NgClass, StatCardComponent],
  templateUrl: './entrepot.html',
  styleUrl: './entrepot.scss',
})
export class EntrepotComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly entrepotStore = inject(EntrepotStore);
  private readonly lotStore = inject(LotStore);

  readonly paysId = signal<string>('br');
  readonly entrepotId = signal<number>(0);

  readonly entrepot = this.entrepotStore.entrepot;
  readonly lots = this.lotStore.lots;

  readonly isLoading = computed(() => {
    return this.entrepotStore.loading() || this.lotStore.loading();
  });

  readonly hasError = computed(() => {
    return !!this.entrepotStore.error() || !!this.lotStore.error();
  });

  readonly entrepotName = computed(() => this.entrepot()?.nom ?? '');
  readonly entrepotAddress = computed(() => this.entrepot()?.adresse ?? '');
  readonly entrepotResponsable = computed(() => this.entrepot()?.responsable ?? '');
  readonly entrepotEmailResponsable = computed(() => this.entrepot()?.emailResponsable ?? '');
  readonly entrepotLatitude = computed(() => this.entrepot()?.latitude ?? 0);
  readonly entrepotLongitude = computed(() => this.entrepot()?.longitude ?? 0);
  readonly entrepotNombreLots = computed(() => this.entrepot()?.nombreLots ?? 0);
  readonly entrepotStockTotal = computed(() => this.entrepot()?.stockTotal ?? 0);

  readonly stats = computed<StatCard[]>(() => {

    const currentLots = this.lots();

    const totalLots = this.entrepot()?.nombreLots ?? NaN;
    const temp = this.entrepot()?.lastTemperature ?? NaN;
    const hum = this.entrepot()?.lastHumidity ?? NaN;


    const lotsPerimes = currentLots.filter(lot => {
      return lot.statut?.toUpperCase().includes('PERIME');
    }).length;

    return [
      {
        title: 'Nombre total de lots',
        value: totalLots.toString(),
        imagePath: '/images/totallot.svg',
        text: 'Total des lots enregistrés dans cet entrepôt',
        color: "yellow"
      },
      {
        title: 'Temperature actuelle',
        value: temp + " °C",
        imagePath: '/images/temp.svg',
        text: 'Temperature de l\'entrepot prise recement',
        color: "blue"
      },
      {
        title: 'Humidité actuelle',
        value: hum + " %",
        imagePath: '/images/hum.svg',
        text: 'Humidité de l\'entrepot prise recement',
        color: "green"
      },
      {
        title: 'Lots périmés',
        value: this.formatNum(lotsPerimes),
        imagePath: '/images/critic.svg',
        text: 'Lots périmés nécessitant une action immédiate',
        color: "red"
      },
    ] satisfies StatCard[];
  });

  constructor() {

    this.route.paramMap.subscribe(params => {
      const routeCode = params.get('paysId')?.trim() ?? 'br';
      const normalizedCode = this.normalizeCountryCode(routeCode);
      this.paysId.set(normalizedCode.toLowerCase());

      const id = params.get('entrepotId');
      this.entrepotId.set(id ? Number.parseInt(id, 10) : 0);

      this.loadData();
    });
  }

  loadData(): void {
    const codePays = this.normalizeCountryCode(this.paysId());

    this.entrepotStore.loadEntrepotById(codePays, this.entrepotId());
    this.lotStore.loadLotsByEntrepot(codePays, this.entrepotId());
  }

  goBack(): void {
    this.router.navigate(['/pays', this.paysId()]);
  }

  voirLot(lotId: string): void {
    this.router.navigate(['/pays', this.paysId(), 'entrepot', this.entrepotId(), 'lot', lotId]);
  }

  formatNum(n: number): string {
    return n.toLocaleString('fr-FR');
  }

  getBadgeClass(statut: string | undefined): string {
    if (!statut) return '';
    const upper = statut.toUpperCase();
    if (upper.includes('CONFORME')) return 'badge--conforme';
    if (upper.includes('ALERTE')) return 'badge--alerte';
    if (upper.includes('PERIME')) return 'badge--perime';
    return '';
  }

  private normalizeCountryCode(code: string | null): string {
    if (!code) return 'br';
    const up = code.toUpperCase().trim();
    switch (up) {
      case 'BR':
      case 'BRA':
      case 'BRASIL':
        return 'BR';
      case 'EC':
      case 'ECU':
      case 'ECUADOR':
        return 'EC';
      case 'CO':
      case 'COL':
      case 'COLOMBIA':
        return 'CO';
      default:
        return up;
    }
  }
}
