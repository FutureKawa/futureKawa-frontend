import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AlerteStore } from '../../core/stores/alerte.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  private readonly alerteStore = inject(AlerteStore);
  readonly isPopupOpen = signal<boolean>(false);

  readonly alertesCount = computed(() => {
    return this.alerteStore.alertesNonTraitees().length;
  });

  readonly alertes = computed(() => {
    return this.alerteStore.alertesNonTraitees();
  });

  constructor() {
    // Charger toutes les alertes au démarrage
    this.alerteStore.loadAllAlertes();
  }

  togglePopup(): void {
    this.isPopupOpen.update(val => !val);
  }

  closePopup(): void {
    this.isPopupOpen.set(true);
  }
}
