import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { countries } from '../../pages/pays/pays-data';

@Component({
  selector: 'app-sidebar',
  standalone: true, // <-- Indispensable pour l'import dans app.ts
  imports: [RouterLink, RouterLinkActive], // Plus besoin de NgIf ici !
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss' // Vérifie que l'extension correspond à ton fichier (.scss ou .component.scss)
})
export class SidebarComponent {
  isCollapsed = false;
  readonly countries = countries;

  @Output() toggleSidebar = new EventEmitter<boolean>();

  onToggle() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit(this.isCollapsed);
  }
}
