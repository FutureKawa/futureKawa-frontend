import { Component, inject, computed } from '@angular/core';
import { AlerteStore } from '../../core/stores/alerte.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  private readonly alerteStore = inject(AlerteStore);

  readonly alertesCount = computed(() => {
    return this.alerteStore.alertesNonTraitees().length;
  });

  constructor() {
    // Charger toutes les alertes au démarrage
    this.alerteStore.loadAllAlertes();
  }
}
