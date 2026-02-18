import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { HistoryResponse } from '../models/daily-entry.model';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/history`;

  getMonth(month: string): Observable<HistoryResponse> {
    return this.http.get<HistoryResponse>(this.base, {
      params: { month },
    });
  }
}
