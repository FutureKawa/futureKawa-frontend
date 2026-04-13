import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

interface Entrepot {
  id: number;
  name: string;
  city: string;
  stock: string;
  stockUnit: string;
  status: string;
  statusLabel: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-pays-chart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pays-chart.html',
  styleUrl: './pays-chart.scss',
})
export class PaysChart implements AfterViewInit {
  @ViewChild('map', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  entrepots: Entrepot[] = [
    {
      id: 1,
      name: 'Entrepôt Recife',
      city: 'Recife',
      stock: '8 050',
      stockUnit: 'kg',
      status: 'CONFORME',
      statusLabel: 'conforme',
      latitude: -8.0476,
      longitude: -34.8770,
    },
    {
      id: 2,
      name: 'Entrepôt Belo Horizonte',
      city: 'Belo Horizonte',
      stock: '12 300',
      stockUnit: 'kg',
      status: 'CONFORME',
      statusLabel: 'conforme',
      latitude: -19.9245,
      longitude: -43.9352,
    },
    {
      id: 3,
      name: 'Entrepôt São Paulo',
      city: 'São Paulo',
      stock: '19 600',
      stockUnit: 'kg',
      status: 'ACTIF',
      statusLabel: 'actif',
      latitude: -23.5505,
      longitude: -46.6333,
    },
    {
      id: 4,
      name: 'Entrepôt Rio de Janeiro',
      city: 'Rio de Janeiro',
      stock: '5 200',
      stockUnit: 'kg',
      status: 'INACTIF',
      statusLabel: 'inactif',
      latitude: -22.9068,
      longitude: -43.1729,
    },
  ];

  selectedEntrepot: Entrepot | null = null;
  private map!: L.Map;

  ngAfterViewInit() {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [-14.2350, -51.9253],
      zoom: 4,
      minZoom: 3,
      maxZoom: 9,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.entrepots.forEach((entrepot) => {
      const marker = L.circleMarker([entrepot.latitude, entrepot.longitude], {
        radius: 10,
        color: '#ffffff',
        weight: 2,
        fillColor: '#10b981',
        fillOpacity: 1,
      }).addTo(this.map);

      const popupHtml = `
        <div class="popup-card">
          <div class="popup-header">
            <div class="font-bold text-lg text-gray-800">
              <div class="popup-title">${entrepot.name}</div>
            </div>
          </div>
          <div class="popup-body mt-2 space-y-1 text-sm text-gray-700">
            <div><strong>Stock :</strong> ${entrepot.stock} ${entrepot.stockUnit}</div>
            <div><strong>Status :</strong> ${entrepot.status}</div>
          </div>
          <button href="/entrepot" class="mt-5 inline-flex w-full justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Voir l'entrepôt</button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'leaflet-popup-custom',
        closeButton: true,
        minWidth: 220,
      });

      marker.on('click', () => {
        this.selectedEntrepot = entrepot;
      });
    });
  }

  closePopup() {
    this.map.closePopup();
    this.selectedEntrepot = null;
  }
}

