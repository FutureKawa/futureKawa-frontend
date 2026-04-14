import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { entrepots as allEntrepots, getCountryByCode, type Entrepot } from '../pays-data';

@Component({
  selector: 'app-pays-chart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pays-chart.html',
  styleUrl: './pays-chart.scss',
})
export class PaysChart implements AfterViewInit, OnChanges {
  @Input() countryCode: string | null = null;
  @ViewChild('map', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  entrepots: Entrepot[] = allEntrepots;
  selectedEntrepot: Entrepot | null = null;
  private map!: L.Map;
  private markers: L.CircleMarker[] = [];

  get countryName(): string {
    return getCountryByCode(this.countryCode)?.name ?? 'Pays';
  }

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

    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map && changes['countryCode']) {
      this.selectedEntrepot = null;
      this.map.closePopup();
      this.updateMarkers();
    }
  }

  private updateMarkers() {
    this.clearMarkers();
    const center = getCountryByCode(this.countryCode)?.defaultCenter ?? [-14.2350, -51.9253];
    this.map.setView(center, 4);

    this.visibleEntrepots.forEach((entrepot) => {
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
          <a href="/entrepot" class="mt-5 inline-flex w-full justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 text-center">Voir l'entrepôt</a>
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
      this.markers.push(marker);
    });
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  get visibleEntrepots() {
    return this.countryCode
      ? this.entrepots.filter(entrepot => entrepot.countryCode === this.countryCode)
      : this.entrepots;
  }

  closePopup() {
    this.map.closePopup();
    this.selectedEntrepot = null;
  }
}

