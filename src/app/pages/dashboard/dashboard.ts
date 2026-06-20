import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { EntrepotStore } from '../../core/stores/entrepot.store';
import { LotStore } from '../../core/stores/lot.store';
import { AlerteStore } from '../../core/stores/alerte.store';
import type { StatCard } from '../pays/pays-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private readonly entrepotStore = inject(EntrepotStore);
  private readonly lotStore = inject(LotStore);
  private readonly alerteStore = inject(AlerteStore);

  ngOnInit() {
    this.entrepotStore.loadAllEntrepots();
    this.lotStore.loadAllLots();
    this.alerteStore.loadAllAlertes();
  }

  readonly totalPays = computed(() => 3);

  readonly totalEntrepots = computed(() => {
    return this.entrepotStore.entrepots().length;
  });

  readonly totalLots = computed(() => {
    return this.lotStore.lots().length;
  });

  readonly alertesCritiques = computed(() => {
    return this.alerteStore.alertesNonTraitees().length;
  });

  readonly stats = computed<StatCard[]>(() => {
    return [
      {
        title: 'Total des pays',
        value: this.totalPays().toLocaleString('fr-FR'),
        imagePath: '/images/country.svg',
        text: 'Pays actuellement suivis sur la plateforme',
        color: "green"
      },
      {
        title: 'Entrepôts actifs',
        value: this.totalEntrepots().toLocaleString('fr-FR'),
        imagePath: '/images/entrepot.svg',
        text: 'Nombre total d’entrepôts enregistrés sur l\'ensemble des pays',
        color: "violet"
      },
      {
        title: 'Nombre total de lots',
        value: this.totalLots().toLocaleString('fr-FR'),
        imagePath: '/images/totallot.svg',
        text: 'Nombre total de lots de café suivis',
        color: "orange"
      },
      {
        title: 'Alertes critiques',
        value: this.alertesCritiques().toLocaleString('fr-FR'),
        imagePath: '/images/critic.svg',
        text: 'Alertes non traitées nécessitant une action',
        color: "red"
      }
    ] satisfies StatCard[];
  });
}
