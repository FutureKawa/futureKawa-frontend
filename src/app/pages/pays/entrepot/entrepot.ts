import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { StatCardComponent } from '../../../components/stat-card/stat-card';
import { EntrepotStore } from '../../../core/stores/entrepot.store';
import { LotStore } from '../../../core/stores/lot.store';

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

  readonly isLoading = computed(() => {
    return this.entrepotStore.loading() || this.lotStore.loading();
  });

  readonly hasError = computed(() => {
    return !!this.entrepotStore.error() || !!this.lotStore.error();
  });

  readonly entrepot = computed(() => {
    const allEntrepots = this.entrepotStore.entrepots();
    const id = this.entrepotId();
    return allEntrepots.find(e => e.id === id) || null;
  });

  readonly lots = computed(() => {
    const allLots = this.lotStore.lots();
    const entrepotId = this.entrepotId();
    return allLots.filter(lot => lot.entrepotId === entrepotId);
  });

  readonly stats = computed(() => {
    const currentLots = this.lots();
    return {
      lotsActifs: currentLots.filter(l => l.statut?.toUpperCase().includes('CONFORME')).length,
      totalLots: currentLots.length,
      qualiteMoyenne: currentLots.filter(l => l.statut?.toUpperCase().includes('PERIME')).length,
      alertes: currentLots.filter(l => l.statut?.toUpperCase().includes('ALERTE')).length
    };
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
