import { Component, inject, OnInit, computed } from '@angular/core';
import { TodayService } from '../../core/services/today.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CheckinMorningComponent } from './checkin-morning/checkin-morning.component';
import { FocusCardComponent } from './focus-card/focus-card.component';
import { DayDoneComponent } from './day-done/day-done.component';

type ViewState = 'loading' | 'morning' | 'focus' | 'done';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    CheckinMorningComponent,
    FocusCardComponent,
    DayDoneComponent,
  ],
  template: `
    <div class="min-h-screen bg-ink">
      @switch (viewState()) {
        @case ('loading') {
          <app-loading-spinner />
        }
        @case ('morning') {
          <app-checkin-morning />
        }
        @case ('focus') {
          <app-focus-card
            [entry]="svc.today()!"
            (checked)="onChecked($event)"
          />
        }
        @case ('done') {
          <app-day-done [entry]="svc.today()!" />
        }
      }
    </div>
  `,
})
export class TodayComponent implements OnInit {
  svc = inject(TodayService);

  viewState = computed<ViewState>(() => {
    const t = this.svc.today();
    if (t === undefined) return 'loading';
    if (t === null) return 'morning';
    if (!t.skipped && t.completed === null) return 'focus';
    return 'done';
  });

  ngOnInit(): void {
    this.svc.load();
  }

  onChecked(completed: boolean): void {
    this.svc.complete(completed).subscribe();
  }
}
