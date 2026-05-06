import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { EntrepotDto } from '../../../shared/models/api/models';

@Component({
  selector: 'app-pays-chart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pays-chart.html',
  styleUrl: './pays-chart.scss',
})
export class PaysChart implements AfterViewInit, OnChanges {
  @Input() countryCode: string | null = null;
  @Input() countryName: string = 'Pays';
  @Input() entrepots: EntrepotDto[] = [];
  @ViewChild('map', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  selectedEntrepot: EntrepotDto | null = null;
  private map!: L.Map;
  private markers: L.CircleMarker[] = [];

  ngAfterViewInit() {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [-14.235, -51.9253],
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
    if (this.map && (changes['countryCode'] || changes['entrepots'])) {
      this.selectedEntrepot = null;
      this.map.closePopup();
      this.updateMarkers();
    }
  }

  private updateMarkers() {
    this.clearMarkers();
    console.log('updateMarkers:', {
      countryCode: this.countryCode,
      entrepots: this.entrepots,
      visibleEntrepots: this.visibleEntrepots
    });
    const center = this.getMapCenter();
    this.map.setView(center, 4);

    if (!this.visibleEntrepots.length) {
      console.warn('Aucun entrepôt visible');
      return;
    }

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
              <div class="popup-title">${entrepot.nom}</div>
            </div>
          </div>
          <div class="popup-body mt-2 space-y-1 text-sm text-gray-700">
            <div><strong>Responsable :</strong> ${entrepot.responsable}</div>
            <div><strong>Lots :</strong> ${entrepot.nombreLots}</div>
          </div>
          <a href="/pays/${this.normalizeCountryCode(entrepot.codePays).toLowerCase()}/entrepot/${entrepot.id}" class="mt-5 inline-flex w-full justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 text-center">Voir l'entrepôt</a>
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
      ? this.entrepots.filter(entrepot => this.normalizeCountryCode(entrepot.codePays) === this.normalizeCountryCode(this.countryCode))
      : this.entrepots;
  }

  private normalizeCountryCode(code: string | null): string {
    if (!code) return '';
    const upper = code.toUpperCase();
    switch (upper) {
      case 'BR':
      case 'BRA':
        return 'BR';
      case 'EC':
      case 'ECU':
        return 'EC';
      case 'CO':
      case 'COL':
        return 'CO';
      default:
        return upper;
    }
  }

  private getMapCenter(): [number, number] {
    const points = this.visibleEntrepots;

    if (points.length === 0) {
      return [-14.235, -51.9253];
    }

    const total = points.reduce(
      (acc, entrepot) => {
        return {
          latitude: acc.latitude + entrepot.latitude,
          longitude: acc.longitude + entrepot.longitude
        };
      },
      { latitude: 0, longitude: 0 }
    );

    return [total.latitude / points.length, total.longitude / points.length];
  }

  closePopup() {
    this.map.closePopup();
    this.selectedEntrepot = null;
  }
}

