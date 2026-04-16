import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConfigurationResponse } from '../../shared/models/api/models';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private readonly apiUrl = `${environment.apiUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  getConfiguration(codePays: string): Observable<ConfigurationResponse> {
    return this.http.get<ConfigurationResponse>(`${this.apiUrl}/${codePays}/configuration`);
  }
}