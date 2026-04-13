import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaysChart } from './pays-chart/pays-chart';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [PaysChart],
  templateUrl: './pays.html',
  styleUrl: './pays.scss'
})
export class PaysComponent {

  private readonly route = inject(ActivatedRoute);

  codePays = signal<string | null>(null);

  stats = signal([
    {
      title: 'Entrepôts actifs',
      value: '40,689',
      icon: '/images/entrepot.svg',
      percent: '8.5%',
      trend: 'up'
    },
    {
      title: 'Nombre total de lots',
      value: '10293',
      icon: '/images/totallot.svg',
      percent: '5.2%',
      trend: 'up'
    },
    {
      title: 'Stock total',
      value: '89,000',
      icon: '/images/totalstock.svg',
      percent: '2.1%',
      trend: 'down'
    },
    {
      title: 'Alertes critiques',
      value: '2040',
      icon: '/images/critic.svg',
      percent: '10.3%',
      trend: 'up'
    }
  ]);

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.codePays.set(params.get('code'));
    });
  }
}