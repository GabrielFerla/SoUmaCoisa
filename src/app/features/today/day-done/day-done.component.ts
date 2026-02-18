import { Component, input } from '@angular/core';
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';
import type { DailyEntry } from '../../../core/models/daily-entry.model';

@Component({
  selector: 'app-day-done',
  standalone: true,
  imports: [FormatDatePipe],
  template: `
    <div class="min-h-screen bg-cream flex flex-col items-center justify-center px-6 gap-6">
      <p class="text-muted text-xs tracking-widest uppercase">
        {{ entry().date | formatDate }}
      </p>
      <h2 class="font-serif text-2xl font-bold text-ink">Dia encerrado</h2>
      <div
        class="w-full max-w-xs bg-ink border border-accent/30 rounded-card p-6"
      >
        <p class="text-accent-light text-xs uppercase tracking-widest mb-2">
          Sua única coisa
        </p>
        <p class="font-serif text-xl italic font-bold text-cream leading-snug">
          "{{ entry().intention }}"
        </p>
        <p class="mt-4 pt-4 border-t border-border/50 text-cream text-sm">
          @switch (statusLabel()) {
            @case ('completed') {
              <span class="text-moss font-semibold">✓ Você fez!</span>
            }
            @case ('not_completed') {
              <span class="text-accent font-semibold">Não fez desta vez</span>
            }
            @case ('skipped') {
              <span class="text-muted">Dia pulado</span>
            }
          }
        </p>
      </div>
    </div>
  `,
})
export class DayDoneComponent {
  entry = input.required<DailyEntry>();

  protected statusLabel(): 'completed' | 'not_completed' | 'skipped' {
    const e = this.entry();
    if (e.skipped) return 'skipped';
    if (e.completed === true) return 'completed';
    return 'not_completed';
  }
}
