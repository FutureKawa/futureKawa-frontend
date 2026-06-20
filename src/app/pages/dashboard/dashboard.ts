import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../components/stat-card/stat-card';
import { EntrepotStore } from '../../core/stores/entrepot.store';
import { LotStore } from '../../core/stores/lot.store';
import { AlerteStore } from '../../core/stores/alerte.store';
import { ConfigurationStore } from '../../core/stores/configuration.store';

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
  private readonly configurationStore = inject(ConfigurationStore);

  ngOnInit() {
    // Charger toutes les données au démarrage
    this.entrepotStore.loadAllEntrepots();
    this.lotStore.loadAllLots();
    this.alerteStore.loadAllAlertes();
  }

  // Statistiques calculées
  readonly totalPays = computed(() => 3); // BR, EC, CO

  readonly totalEntrepots = computed(() => {
    return this.entrepotStore.entrepots().length;
  });

  readonly totalLots = computed(() => {
    return this.lotStore.lots().length;
  });

  readonly alertesCritiques = computed(() => {
    return this.alerteStore.alertesNonTraitees().length;
  });
}
