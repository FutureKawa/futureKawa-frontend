import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { EntrepotStore, LotStore } from '../../../../shared';

interface ChartPoint {
  minutes: number; // minutes depuis 00:00
  value: number;
}

interface ChartGeometry {
  pathD: string;
  peak: { x: number; y: number; value: number } | null;
  xTicks: { x: number; label: string }[];
  yTicks: { y: number; value: number }[];
  thresholdLines: { y: number; value: number; colorClass: string }[];
}

const VIEW_WIDTH = 760;
const VIEW_HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 32, left: 36 };
const Y_MAX = 40;

// Seuils par défaut si non fournis par le backend
const DEFAULT_SEUIL_MIN = 33;
const DEFAULT_SEUIL_CIBLE = 35;
const DEFAULT_SEUIL_MAX = 37;

@Component({
  selector: 'app-lot',
  standalone: true,
  imports: [DatePipe, NgClass, NgTemplateOutlet],
  templateUrl: './lot.html',
})
export class Lot {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly entrepotStore = inject(EntrepotStore);
  private readonly lotStore = inject(LotStore);

  // ---- Paramètres de route (même pattern que EntrepotComponent) ----

  readonly paysId = signal<string>('br');
  readonly entrepotId = signal<number>(0);
  readonly lotId = signal<string>('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const routeCode = params.get('paysId')?.trim() ?? 'br';
      this.paysId.set(this.normalizeCountryCode(routeCode).toLowerCase());

      const entId = params.get('entrepotId');
      this.entrepotId.set(entId ? Number.parseInt(entId, 10) : 0);

      const lId = params.get('lotId');
      this.lotId.set(lId ?? '');
    });
  }

  goBack(): void {
    this.router.navigate(['pays', this.paysId(), 'entrepot', this.entrepotId()]);
  }

  // ---- États dérivés des stores déjà chargés par la page entrepôt ----
  // Aucun appel backend ici : l'entrepôt et les lots sont déjà en mémoire
  // (chargés par EntrepotComponent juste avant la navigation vers ce détail).

  readonly entrepot = this.entrepotStore.entrepot;
  readonly lots = this.lotStore.lots;

  // Le lot affiché : on le retrouve dans la liste déjà chargée, par id
  readonly lot = computed(() => this.lots().find((l) => String(l.id) === this.lotId()));

  readonly hasError = computed(() => !this.lot());

  readonly entrepotName = computed(() => this.entrepot()?.nom ?? '');

  // ---- Présentation lot (fiche gauche) ----

  readonly lotNumero = computed(() => this.lot()?.id ?? this.lotId());
  readonly lotStatut = computed(() => this.lot()?.statut ?? '');
  readonly lotTypeCafe = computed(() => this.lot()?.typeCafe ?? '');
  readonly lotDateStockage = computed(() => this.lot()?.dateStockage ?? null);
  readonly lotPoidsKg = computed(() => this.lot()?.poids ?? null);
  readonly lotJoursRestants = computed(() => this.lot()?.joursRestants ?? null);

  // Le LotDto n'a pas ses propres mesures : on affiche celles de l'entrepôt (déjà en mémoire)
  readonly lotDerniereTemperature = computed(() => this.entrepot()?.lastTemperature ?? null);
  readonly lotDerniereHumidite = computed(() => this.entrepot()?.lastHumidity ?? null);
  readonly lotDerniereRemontee = computed(() => this.lot()?.dateMaj ?? null);

  getBadgeClass(statut: string | undefined): string {
    if (!statut) return '';
    const upper = statut.toUpperCase();
    if (upper.includes('CONFORME')) return 'badge--conforme';
    if (upper.includes('ALERTE')) return 'badge--alerte';
    if (upper.includes('PERIME')) return 'badge--perime';
    if (upper.includes('EXPEDIER')) return 'badge--a-expedier';
    return '';
  }

  readonly statutBadgeClass = computed(() => this.getBadgeClass(this.lotStatut()));

  // ---- Courbes (température / humidité) ----
  // Le LotDto n'expose pas d'historique de mesures pour l'instant.
  // On affiche uniquement le point de mesure courant (celui de l'entrepôt),
  // placé sur la courbe à l'heure actuelle. Pas de données fabriquées.

  readonly viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
  readonly plotLeft = PADDING.left;
  readonly plotRight = VIEW_WIDTH - PADDING.right;
  readonly plotTop = PADDING.top;
  readonly plotBottom = VIEW_HEIGHT - PADDING.bottom;

  private nowMinutes(): number {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  readonly temperaturePoints = computed<ChartPoint[]>(() => {
    const v = this.lotDerniereTemperature();
    return v != null ? [{ minutes: this.nowMinutes(), value: Number(v) }] : [];
  });

  readonly humidityPoints = computed<ChartPoint[]>(() => {
    const v = this.lotDerniereHumidite();
    return v != null ? [{ minutes: this.nowMinutes(), value: Number(v) }] : [];
  });

  private scaleX(minutes: number): number {
    const w = VIEW_WIDTH - PADDING.left - PADDING.right;
    return PADDING.left + (minutes / (24 * 60)) * w;
  }

  private scaleY(value: number): number {
    const h = VIEW_HEIGHT - PADDING.top - PADDING.bottom;
    const clamped = Math.max(0, Math.min(value, Y_MAX));
    return PADDING.top + h - (clamped / Y_MAX) * h;
  }

  private smoothPath(coords: { x: number; y: number }[]): string {
    if (coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let d = `M ${coords[0].x} ${coords[0].y}`;
    const tension = 6;

    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i - 1] ?? coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / tension;
      const cp1y = p1.y + (p2.y - p0.y) / tension;
      const cp2x = p2.x - (p3.x - p1.x) / tension;
      const cp2y = p2.y - (p3.y - p1.y) / tension;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  private buildGeometry(points: ChartPoint[]): ChartGeometry {
    const coords = points.map((p) => ({ x: this.scaleX(p.minutes), y: this.scaleY(p.value), value: p.value }));

    const peakPoint = coords.length > 0 ? coords.reduce((max, c) => (c.value > max.value ? c : max), coords[0]) : null;

    const xTicks = Array.from({ length: 13 }, (_, i) => {
      const minutes = i * 120;
      const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
      return { x: this.scaleX(minutes), label: `${hh}:00` };
    });

    const yTicks = [0, 5, 10, 15, 20, 25, 30, 35, 40].map((v) => ({ y: this.scaleY(v), value: v }));

    const lotAny = this.lot() as any;
    const seuilMax = lotAny?.seuilMax ?? DEFAULT_SEUIL_MAX;
    const seuilCible = lotAny?.seuilCible ?? DEFAULT_SEUIL_CIBLE;
    const seuilMin = lotAny?.seuilMin ?? DEFAULT_SEUIL_MIN;

    const thresholdLines = [
      { y: this.scaleY(seuilMax), value: seuilMax, colorClass: 'stroke-red-500' },
      { y: this.scaleY(seuilCible), value: seuilCible, colorClass: 'stroke-blue-600' },
      { y: this.scaleY(seuilMin), value: seuilMin, colorClass: 'stroke-emerald-500' },
    ];

    return {
      pathD: coords.length >= 2 ? this.smoothPath(coords) : '',
      peak: peakPoint ? { x: peakPoint.x, y: peakPoint.y, value: peakPoint.value } : null,
      xTicks,
      yTicks,
      thresholdLines,
    };
  }

  readonly temperatureChart = computed<ChartGeometry>(() => this.buildGeometry(this.temperaturePoints()));
  readonly humidityChart = computed<ChartGeometry>(() => this.buildGeometry(this.humidityPoints()));

  // ---- Utilitaires ----

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