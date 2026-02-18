import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { DailyEntry } from '../models/daily-entry.model';

@Injectable({ providedIn: 'root' })
export class TodayService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/today`;

  /** undefined = carregando | null = sem entrada | DailyEntry = existe */
  today = signal<DailyEntry | null | undefined>(undefined);

  load(): void {
    this.http.get<DailyEntry | null>(this.base).subscribe({
      next: (e) => this.today.set(e),
      error: () => this.today.set(null),
    });
  }

  create(intention: string) {
    return this.http
      .post<DailyEntry>(this.base, { intention })
      .pipe(tap((e) => this.today.set(e)));
  }

  complete(completed: boolean) {
    return this.http
      .patch<DailyEntry>(`${this.base}/complete`, { completed })
      .pipe(tap((e) => this.today.set(e)));
  }

  skip() {
    return this.http
      .patch<DailyEntry>(`${this.base}/skip`, {})
      .pipe(tap((e) => this.today.set(e)));
  }
}
