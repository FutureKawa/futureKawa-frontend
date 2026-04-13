import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { EntrepotInfo } from '../../shared/models/entrepots/EntrepotInfo';
import { EntrepotStats } from '../../shared/models/entrepots/EntrepotStats';
import { Lot } from '../../shared/models/entrepots/Lot';
import { MOCK_ENTREPOTS, MOCK_LOTS, MOCK_STATS } from '../../app.constants';

@Component({
  selector: 'app-entrepot',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './entrepot.html',
  styleUrl: './entrepot.scss',
})
export class EntrepotComponent implements OnInit {
  readonly paysId     = signal<string>('br');
  readonly entrepotId = signal<string>('ent-001');
  readonly isLoading  = signal<boolean>(true);
  readonly hasError   = signal<boolean>(false);
  readonly entrepot   = signal<EntrepotInfo | null>(null);
  readonly lots       = signal<Lot[]>([]);
  readonly stats      = signal<EntrepotStats | null>(null);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.paysId.set(params.get('paysId')     ?? 'br');
      this.entrepotId.set(params.get('entrepotId') ?? 'ent-001');
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    // TODO: remplacer par HttpClient — exemple test :
    // combineLatest([
    //   this.http.get<EntrepotInfo>(`/api/pays/${this.paysId()}/entrepots/${this.entrepotId()}`),
    //   this.http.get<Lot[]>(`/api/pays/${this.paysId()}/entrepots/${this.entrepotId()}/lots`),
    //   this.http.get<EntrepotStats>(`/api/pays/${this.paysId()}/entrepots/${this.entrepotId()}/stats`),
    // ]).subscribe({ next: ([entrepot, lots, stats]) => { ... }, error: () => this.hasError.set(true) });
    this.entrepot.set(MOCK_ENTREPOTS[this.entrepotId()] ?? MOCK_ENTREPOTS['ent-001']);
    this.lots.set([...MOCK_LOTS]);
    this.stats.set({ ...MOCK_STATS });
    this.isLoading.set(false);
  }

  goBack(): void {
    this.router.navigate(['/pays', this.paysId()]);
  }

  voirLot(lotId: string): void {
    // TODO: créer la page détail lot
    this.router.navigate(['/pays', this.paysId(), 'entrepot', this.entrepotId(), 'lot', lotId]);
  }

  // TODO: activer quand l'API DELETE sera disponible
  // supprimerLot(lotId: string): void {
  //   if (!window.confirm('Supprimer ce lot ? Cette action est irréversible.')) return;
  //   // DELETE /api/pays/:paysId/lots/:lotId
  //   this.lots.update(list => list.filter(l => l.id !== lotId));
  // }

  formatNum(n: number): string {
    return n.toLocaleString('fr-FR');
  }
}
