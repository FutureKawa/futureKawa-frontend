import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LotDto, LotResponse } from '../../shared/models/api/models';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  getAllLots(codePays: string): Observable<LotResponse> {
    return this.http.get<LotResponse>(`${this.apiUrl}/${codePays}/lots`);
  }

  getLotByFunctionalId(codePays: string, lotId: string): Observable<LotDto> {
    return this.http.get<LotDto>(`${this.apiUrl}/${codePays}/lots/search`, {
      params: { lotId }
    });
  }

  getLotsByEntrepot(codePays: string, entrepotId: number): Observable<LotResponse> {
    return this.http.get<LotResponse>(`${this.apiUrl}/${codePays}/lots/entrepot/${entrepotId}`);
  }

  getAllLotsAllPays(): Observable<LotDto[]> {
    return this.http.get<LotDto[]>(`${this.apiUrl}/lots/all`);
  }
}