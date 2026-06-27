import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface InventoryLot {
  id: number;
  code?: string;
  lotId?: string;
  entrepotId?: number;
  entrepotNom?: string;
  nomEntrepot?: string;
  typeCafe: string;
  dateStockage: string;
  statut: string;
  poids?: number;
  poidsKg?: number;
  joursRestants?: number | null;
  dateMaj?: string | null;
}

interface InventoryLotResponse {
  lots: InventoryLot[];
  total: number;
  codePays: string;
}

interface InventoryConfiguration {
  codePays: string;
  pays: string;
  tempIdeal: number;
  humiditeIdeal: number;
  tempMin: number;
  tempMax: number;
  humiditeMin: number;
  humiditeMax: number;
  totalEntrepots?: number;
  alertes?: number;
  dureeConservation?: number;
}

interface InventoryMesure {
  entrepotId: number;
  temperature: number;
  humidity: number;
  timestamp: string;
  conforme?: boolean;
}

interface CountrySection {
  code: string;
  flag: string;
  configuration: InventoryConfiguration | null;
  lots: InventoryLot[];
  // Dernière mesure relevée par le capteur (ESP/MQTT) de chaque entrepôt, indexée par entrepotId.
  measures: Record<number, InventoryMesure>;
  total: number;
  page: number;
  size: number;
  paged: boolean;
  loading: boolean;
  error: string | null;
}

const COUNTRY_FLAGS: Record<string, string> = {
  BR: '🇧🇷',
  EC: '🇪🇨',
  CO: '🇨🇴',
};

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  private readonly _sections = signal<CountrySection[]>([
    { code: 'BR', flag: COUNTRY_FLAGS['BR'], configuration: null, lots: [], measures: {}, total: 0, page: 0, size: 9, paged: true, loading: false, error: null },
    { code: 'EC', flag: COUNTRY_FLAGS['EC'], configuration: null, lots: [], measures: {}, total: 0, page: 0, size: 9, paged: false, loading: false, error: null },
    { code: 'CO', flag: COUNTRY_FLAGS['CO'], configuration: null, lots: [], measures: {}, total: 0, page: 0, size: 9, paged: false, loading: false, error: null },
  ]);

  readonly sections = this._sections.asReadonly();

  ngOnInit(): void {
    this._sections().forEach(section => {
      this.loadConfiguration(section.code);
      this.loadLots(section.code, 0);
    });
  }

  private updateSection(code: string, patch: Partial<CountrySection>): void {
    this._sections.update(list =>
      list.map(s => (s.code === code ? { ...s, ...patch } : s))
    );
  }

  private loadConfiguration(code: string): void {
    this.http
      .get<InventoryConfiguration>(`${this.apiUrl}/${code}/configuration`)
      .pipe(catchError(() => of(null)))
      .subscribe(configuration => this.updateSection(code, { configuration }));
  }

  private loadLots(code: string, page: number): void {
    const section = this._sections().find(s => s.code === code);
    if (!section) return;

    this.updateSection(code, { loading: true, error: null });

    const url = section.paged
      ? `${this.apiUrl}/${code}/lots/paged`
      : `${this.apiUrl}/${code}/lots`;

    const params = section.paged
      ? new HttpParams().set('page', page.toString()).set('size', section.size.toString())
      : new HttpParams();

    this.http
      .get<InventoryLotResponse>(url, { params })
      .pipe(
        catchError(err => {
          this.updateSection(code, {
            lots: [],
            total: 0,
            loading: false,
            error: err?.message ?? 'Erreur de chargement',
          });
          return of(null);
        })
      )
      .subscribe(response => {
        if (!response) return;
        const lots = response.lots ?? [];
        this.updateSection(code, {
          lots,
          total: response.total ?? 0,
          page,
          loading: false,
        });
        this.loadMeasures(code, lots);
      });
  }

  private loadMeasures(code: string, lots: InventoryLot[]): void {
    const entrepotIds = Array.from(
      new Set(lots.map(l => l.entrepotId).filter((id): id is number => id != null))
    );
    if (entrepotIds.length === 0) {
      this.updateSection(code, { measures: {} });
      return;
    }

    const calls = entrepotIds.map(id =>
      this.http
        .get<InventoryMesure[]>(`${this.apiUrl}/${code}/mesures/entrepot/${id}`)
        .pipe(catchError(() => of([] as InventoryMesure[])))
    );

    forkJoin(calls).subscribe(results => {
      const measures: Record<number, InventoryMesure> = {};
      results.forEach((mesures, idx) => {
        const latest = this.latestMesure(mesures);
        if (latest) measures[entrepotIds[idx]] = latest;
      });
      this.updateSection(code, { measures });
    });
  }

  private latestMesure(mesures: InventoryMesure[]): InventoryMesure | null {
    if (!mesures?.length) return null;
    // La mesure la plus récente (timestamp le plus grand).
    return [...mesures].sort((a, b) =>
      (b.timestamp ?? '').localeCompare(a.timestamp ?? '')
    )[0];
  }

  totalPages(section: CountrySection): number {
    if (!section.total || !section.size) return 1;
    return Math.max(1, Math.ceil(section.total / section.size));
  }

  rangeLabel(section: CountrySection): string {
    const visible = section.paged ? section.lots.length : Math.min(section.lots.length, section.size);
    const start = section.lots.length === 0 ? 0 : section.page * section.size + 1;
    const end = section.page * section.size + visible;
    return `${this.pad(start)}-${this.pad(end)} / ${section.total}`;
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  previousPage(section: CountrySection): void {
    if (!section.paged || section.page <= 0 || section.loading) return;
    this.loadLots(section.code, section.page - 1);
  }

  nextPage(section: CountrySection): void {
    if (!section.paged || section.loading) return;
    if (section.page + 1 >= this.totalPages(section)) return;
    this.loadLots(section.code, section.page + 1);
  }

  displayedLots(section: CountrySection): InventoryLot[] {
    const lots = section.paged ? section.lots : section.lots.slice(0, section.size);
    // Priorité FIFO : les lots les plus anciens d'abord (tri par date de stockage croissante).
    return [...lots].sort((a, b) => (a.dateStockage ?? '').localeCompare(b.dateStockage ?? ''));
  }

  lotCode(lot: InventoryLot): string {
    return lot.code ?? lot.lotId ?? `#${lot.id}`;
  }

  entrepotName(lot: InventoryLot): string {
    return lot.entrepotNom ?? lot.nomEntrepot ?? '—';
  }

  quantity(lot: InventoryLot): string {
    const value = lot.poidsKg ?? lot.poids;
    if (value == null) return '—';
    return `${value.toLocaleString('fr-FR')} kg`;
  }

  tempHum(section: CountrySection, lot: InventoryLot): string {
    const m = lot.entrepotId != null ? section.measures[lot.entrepotId] : undefined;
    if (!m) return '—';
    return `${Number(m.temperature).toFixed(1)}°C - ${Number(m.humidity).toFixed(1)}%`;
  }

  statutClass(statut: string): string {
    const s = (statut ?? '').toUpperCase();
    if (s === 'CONFORME' || s === 'NORMAL') return 'badge--normal';
    if (s === 'A_EXPEDIER' || s === 'ALERTE' || s === 'MEDIUM') return 'badge--medium';
    if (s === 'PERIME' || s === 'HIGH') return 'badge--high';
    return 'badge--normal';
  }

  statutLabel(statut: string): string {
    const s = (statut ?? '').toUpperCase();
    if (s === 'CONFORME') return 'CONFORME';
    if (s === 'A_EXPEDIER') return 'À EXPÉDIER';
    if (s === 'PERIME') return 'PÉRIMÉ';
    return s || 'CONFORME';
  }
}
