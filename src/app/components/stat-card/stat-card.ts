import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCardComponent {
  @Input() title: string = 'Titre par défaut';
  @Input() value: string | number = '0';
  @Input() icon: string = '📊';
}
