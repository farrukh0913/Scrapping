import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ZameenService {
  private baseUrl = 'http://localhost:3000/api/properties'; // Backend URL

  constructor(private http: HttpClient) {}

  getProperties(citySlug: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?city=${citySlug}`);
  }
}
