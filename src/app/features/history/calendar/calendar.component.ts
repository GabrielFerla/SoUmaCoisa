import { Component, input, computed } from '@angular/core';
import type { DailyEntry } from '../../../core/models/daily-entry.model';

type DayState = 'completed' | 'not_completed' | 'skipped' | 'future' | 'today_no_entry' | 'past_no_entry';

interface DayCell {
  day: number | null;
  dateStr: string; // 'YYYY-MM-DD'
  state: DayState;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  template: `
    <div class="bg-warm-white rounded-card border border-border p-4 shadow-card">
      <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        <span>Dom</span>
        <span>Seg</span>
        <span>Ter</span>
        <span>Qua</span>
        <span>Qui</span>
        <span>Sex</span>
        <span>Sáb</span>
      </div>
      <div class="grid grid-cols-7 gap-1">
        @for (cell of grid(); track cell.dateStr + '-' + cell.day) {
          <div
            class="aspect-square flex items-center justify-center rounded-tag text-sm font-sans font-medium transition-colors"
            [class]="cellClasses(cell)"
          >
            @if (cell.day !== null) {
              {{ cell.day }}
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class CalendarComponent {
  month = input.required<string>(); // 'YYYY-MM'
  entries = input<DailyEntry[]>([]);

  private todayStr = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  grid = computed(() => {
    const m = this.month();
    const entries = this.entries();
    const [y, mo] = m.split('-').map(Number);
    const first = new Date(y, mo - 1, 1);
    const daysInMonth = new Date(y, mo, 0).getDate();
    const startOffset = first.getDay();

    const cells: DayCell[] = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null, dateStr: '', state: 'future' });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${y}-${String(mo).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const state = this.getDayState(dateStr, entries);
      cells.push({ day, dateStr, state });
    }

    return cells;
  });

  private getDayState(dateStr: string, entries: DailyEntry[]): DayState {
    const entry = entries.find((e) => e.date === dateStr);
    const isToday = dateStr === this.todayStr;
    const isFuture = dateStr > this.todayStr;

    if (entry) {
      if (entry.skipped) return 'skipped';
      if (entry.completed === true) return 'completed';
      if (entry.completed === false) return 'not_completed';
      return 'past_no_entry';
    }
    if (isFuture) return 'future';
    if (isToday) return 'today_no_entry';
    return 'past_no_entry';
  }

  protected cellClasses(cell: DayCell): string {
    switch (cell.state) {
      case 'completed':
        return 'bg-moss text-white';
      case 'not_completed':
        return 'bg-accent text-white';
      case 'skipped':
        return 'bg-border text-muted';
      case 'future':
        return 'bg-warm-white/50 text-muted';
      case 'today_no_entry':
        return 'bg-warm-white ring-2 ring-accent text-ink';
      default:
        return 'bg-warm-white/50 text-muted';
    }
  }
}
