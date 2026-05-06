import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlerteDto, AlerteResponse } from '../../shared/models/api/models';

@Injectable({
  providedIn: 'root',
})
export class AlerteService {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  getAllAlertes(codePays: string): Observable<AlerteResponse> {
    return this.http.get<AlerteResponse>(`${this.apiUrl}/${codePays}/alertes`);
  }

  getAlertesByLot(codePays: string, lotId: number): Observable<AlerteResponse> {
    return this.http.get<AlerteResponse>(`${this.apiUrl}/${codePays}/alertes/lot/${lotId}`);
  }

  getAllAlertesAllPays(): Observable<AlerteDto[]> {
    return this.http.get<AlerteDto[]>(`${this.apiUrl}/alertes/all`);
  }
}
