import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { DailyEntry } from '../models/daily-entry.model';

/** Resposta é considerada entrada válida só se tiver id e date */
export function isValidEntry(e: unknown): e is DailyEntry {
  return (
    e != null &&
    typeof e === 'object' &&
    'id' in e &&
    typeof (e as DailyEntry).id === 'string' &&
    'date' in e
  );
}

@Injectable({ providedIn: 'root' })
export class TodayService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/today`;

  /** undefined = carregando | null = sem entrada | DailyEntry = existe */
  today = signal<DailyEntry | null | undefined>(undefined);

  load(): void {
    this.today.set(undefined);
    this.http.get<DailyEntry | null>(this.base).subscribe({
      next: (e) => this.today.set(isValidEntry(e) ? e : null),
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
