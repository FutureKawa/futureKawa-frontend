import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { countries as fallbackCountries } from '../../pages/pays/pays-data';
import { ConfigurationService } from '../../core/services/configuration.service';
import { catchError, map, of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true, // <-- Indispensable pour l'import dans app.ts
  imports: [RouterLink, RouterLinkActive], // Plus besoin de NgIf ici !
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss' // Vérifie que l'extension correspond à ton fichier (.scss ou .component.scss)
})
export class SidebarComponent {
  private readonly configurationService = inject(ConfigurationService);

  isCollapsed = false;
  readonly countries = signal(this.buildFallbackCountries());

  @Output() toggleSidebar = new EventEmitter<boolean>();

  constructor() {
    this.loadCountriesFromConfiguration();
  }

  onToggle() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit(this.isCollapsed);
  }

  private getEmojiByCode(codePays: string): string {
    switch (codePays.toUpperCase()) {
      case 'BR':
      case 'BRA':
        return '🇧🇷';
      case 'EC':
      case 'ECU':
        return '🇪🇨';
      case 'CO':
      case 'COL':
        return '🇨🇴';
      default:
        return '🌍';
    }
  }

  private loadCountriesFromConfiguration(): void {
    const fixedCountryCodes = ['BR', 'EC', 'CO'];

    forkJoin(
      fixedCountryCodes.map(code =>
        this.configurationService.getConfiguration(code).pipe(
          map(configuration => ({
            code: configuration.codePays.toUpperCase(),
            name: configuration.pays,
            emoji: this.getEmojiByCode(configuration.codePays)
          })),
          catchError(() => of(null))
        )
      )
    ).subscribe(configuredCountries => {
      console.log(configuredCountries);
      
      const validCountries = configuredCountries.filter(country => country !== null);

      if (validCountries.length > 0) {
        this.countries.set(validCountries);
      }
    });
  }

  private buildFallbackCountries() {
    return fallbackCountries.map(country => ({
      code: country.code.toUpperCase(),
      name: country.name,
      emoji: country.emoji
    }));
  }
}
