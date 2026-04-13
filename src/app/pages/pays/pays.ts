import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaysChart } from './pays-chart/pays-chart';
import { countries, getCountryByCode, getCountryStatsByCode, type Country } from './pays-data';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [PaysChart],
  templateUrl: './pays.html',
  styleUrl: './pays.scss'
})
export class PaysComponent {

  private readonly route = inject(ActivatedRoute);

  readonly countries = countries;
  selectedCountry = signal<Country | null>(null);
  countryName = computed(() => this.selectedCountry()?.name ?? 'Pays');
  stats = computed(() => getCountryStatsByCode(this.selectedCountry()?.code ?? null));

  constructor() {
    this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      this.selectedCountry.set(getCountryByCode(code));
    });
  }
}