import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { HistoryService } from '../../core/services/history.service';
import { CalendarComponent } from './calendar/calendar.component';
import type { HistoryResponse } from '../../core/models/daily-entry.model';

function formatMonthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function prevMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  if (m === 1) return `${y - 1}-12`;
  return `${y}-${String(m - 1).padStart(2, '0')}`;
}

function nextMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  if (m === 12) return `${y + 1}-01`;
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NavbarComponent, CalendarComponent],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-warm-white px-4 py-5">
      <div class="max-w-xs mx-auto">
        <h1 class="font-serif text-xl font-bold text-ink mb-4">Histórico</h1>

        <div class="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            (click)="goPrevMonth()"
            class="size-8 flex items-center justify-center rounded-btn border border-border text-ink hover:bg-border/50 transition-colors text-lg leading-none"
            aria-label="Mês anterior"
          >
            ‹
          </button>
          <span class="font-sans text-sm font-semibold text-ink capitalize">
            {{ monthLabel() }}
          </span>
          <button
            type="button"
            (click)="goNextMonth()"
            class="size-8 flex items-center justify-center rounded-btn border border-border text-ink hover:bg-border/50 transition-colors text-lg leading-none"
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>

        @if (loading()) {
          <p class="text-muted text-xs">Carregando...</p>
        } @else if (errorMessage()) {
          <p class="text-accent text-xs">{{ errorMessage() }}</p>
        } @else if (data()) {
          <div class="mb-3 flex flex-wrap gap-2 text-xs">
            <span class="bg-moss-pale text-moss px-2 py-0.5 rounded-tag font-medium">
              Fez: {{ data()!.summary.completed }}
            </span>
            <span class="bg-accent-pale text-accent px-2 py-0.5 rounded-tag font-medium">
              Não fez: {{ data()!.summary.not_completed }}
            </span>
            <span class="bg-border text-muted px-2 py-0.5 rounded-tag font-medium">
              Pulou: {{ data()!.summary.skipped }}
            </span>
          </div>
          <app-calendar
            [month]="currentMonth()"
            [entries]="data()!.entries"
          />
        }
      </div>
    </div>
  `,
})
export class HistoryComponent implements OnInit {
  private historySvc = inject(HistoryService);

  currentMonth = signal(getCurrentMonth());
  data = signal<HistoryResponse | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  monthLabel = computed(() => formatMonthLabel(this.currentMonth()));

  protected goPrevMonth(): void {
    this.setMonth(prevMonth(this.currentMonth()));
  }
  protected goNextMonth(): void {
    this.setMonth(nextMonth(this.currentMonth()));
  }

  ngOnInit(): void {
    this.loadMonth(this.currentMonth());
  }

  setMonth(month: string): void {
    this.currentMonth.set(month);
    this.loadMonth(month);
  }

  private loadMonth(month: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.historySvc.getMonth(month).subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o histórico.');
        this.data.set(null);
        this.loading.set(false);
      },
    });
  }
}
