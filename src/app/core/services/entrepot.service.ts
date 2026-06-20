import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {EntrepotDto, EntrepotONEResponse, EntrepotResponse} from '../../shared/models/api/models';

@Injectable({
  providedIn: 'root'
})
export class EntrepotService {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  getAllEntrepots(codePays: string): Observable<EntrepotResponse> {
    return this.http.get<EntrepotResponse>(`${this.apiUrl}/${codePays}/entrepots`);
  }

  getEntrepotById(codePays: string, id: number): Observable<EntrepotONEResponse> {
    return this.http.get<EntrepotONEResponse>(`${this.apiUrl}/${codePays}/entrepots/${id}`);
  }

  getAllEntrepotsAllPays(): Observable<EntrepotDto[]> {
    return this.http.get<EntrepotDto[]>(`${this.apiUrl}/entrepots/all`);
  }
}
