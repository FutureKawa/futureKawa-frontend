import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MesureResponse } from '../../shared/models/api/models';

@Injectable({
  providedIn: 'root'
})
export class MesureService {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  getMesuresByLot(codePays: string, lotId: number): Observable<MesureResponse> {
    return this.http.get<MesureResponse>(`${this.apiUrl}/${codePays}/mesures/lot/${lotId}`);
  }
}