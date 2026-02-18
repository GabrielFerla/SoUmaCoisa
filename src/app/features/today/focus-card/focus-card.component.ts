import { Component, input, output } from '@angular/core';
import { FormatDatePipe } from '../../../shared/pipes/format-date.pipe';
import type { DailyEntry } from '../../../core/models/daily-entry.model';

@Component({
  selector: 'app-focus-card',
  standalone: true,
  imports: [FormatDatePipe],
  template: `
    <div class="min-h-screen bg-cream flex flex-col items-center justify-center px-6 gap-6">
      <p class="text-muted text-xs tracking-widest uppercase">
        {{ entry().date | formatDate }}
      </p>
      <h2 class="font-serif text-2xl font-bold text-ink">Seu foco hoje</h2>
      <div
        class="w-full max-w-xs bg-ink border border-accent/30 rounded-card p-6"
      >
        <p class="text-accent-light text-xs uppercase tracking-widest mb-2">
          Sua única coisa
        </p>
        <p
          class="font-serif text-xl italic font-bold text-cream leading-snug"
        >
          "{{ entry().intention }}"
        </p>
      </div>
      <div class="flex gap-3 w-full max-w-xs">
        <button
          type="button"
          (click)="checked.emit(true)"
          class="flex-1 bg-moss-pale text-moss rounded-btn py-3 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          ✓ Fiz isso
        </button>
        <button
          type="button"
          (click)="checked.emit(false)"
          class="flex-1 bg-accent-pale text-accent rounded-btn py-3 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          ✗ Não fiz
        </button>
      </div>
    </div>
  `,
})
export class FocusCardComponent {
  entry = input.required<DailyEntry>();
  checked = output<boolean>();
}
