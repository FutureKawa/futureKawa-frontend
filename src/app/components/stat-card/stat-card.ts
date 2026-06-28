import { Component, input } from '@angular/core';
import type { StatCard } from '../../pages/pays/pays-data';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCardComponent {
  readonly stat = input.required<StatCard>();
}
