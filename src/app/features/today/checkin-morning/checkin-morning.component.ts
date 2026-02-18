import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TodayService } from '../../../core/services/today.service';

@Component({
  selector: 'app-checkin-morning',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-ink flex flex-col items-center justify-center px-6 gap-6">
      <p class="text-accent-light text-xs font-semibold tracking-widest uppercase">
        Bom dia, {{ user()?.displayName }} ☀️
      </p>
      <h1
        class="font-serif text-3xl italic font-bold text-cream text-center leading-snug"
      >
        "Qual a única coisa que vai fazer hoje valer a pena?"
      </h1>
      <textarea
        [(ngModel)]="intention"
        placeholder="Sua única coisa..."
        class="w-full max-w-xs bg-white/10 border border-accent/40 rounded-btn p-4 text-cream text-sm placeholder-muted resize-none focus:outline-none focus:border-accent"
        rows="3"
      ></textarea>
      <button
        type="button"
        (click)="submit()"
        [disabled]="!intention.trim() || loading()"
        class="w-full max-w-xs bg-accent text-cream rounded-btn py-3 font-bold text-sm hover:bg-accent-light transition-colors disabled:opacity-40"
      >
        {{ loading() ? 'Salvando...' : 'Definir minha coisa' }}
      </button>
      <button
        type="button"
        (click)="skip()"
        [disabled]="loading()"
        class="text-muted text-xs hover:text-cream transition-colors disabled:opacity-40"
      >
        pular por hoje
      </button>
    </div>
  `,
})
export class CheckinMorningComponent {
  private auth = inject(AuthService);
  private todaySvc = inject(TodayService);

  user = this.auth.currentUser;
  intention = '';
  loading = signal(false);

  submit() {
    const text = this.intention.trim();
    if (!text) return;
    this.loading.set(true);
    this.todaySvc.create(text).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  skip() {
    this.loading.set(true);
    this.todaySvc.skip().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
