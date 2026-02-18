import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TodayService } from '../../../core/services/today.service';

function getHourInTimezone(timezone?: string): number {
  try {
    const parts = new Intl.DateTimeFormat('pt-BR', {
      timeZone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: 'numeric',
      hour12: false,
    }).formatToParts(new Date());
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '0';
    return parseInt(hour, 10);
  } catch {
    return new Date().getHours();
  }
}

@Component({
  selector: 'app-checkin-morning',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-ink flex flex-col items-center justify-center px-6 gap-6">
      <p class="text-accent-light text-xs font-semibold tracking-widest uppercase">
        {{ greeting().text }}{{ displayName() ? ', ' + displayName() : '' }} {{ greeting().emoji }}
      </p>
      <h1
        class="font-serif text-3xl italic font-bold text-cream text-center leading-snug"
      >
        "Qual a única coisa que vai fazer hoje valer a pena?"
      </h1>
      @if (errorMessage()) {
        <p class="text-accent-light text-sm w-full max-w-xs">{{ errorMessage() }}</p>
      }
      <textarea
        [(ngModel)]="intention"
        placeholder="Sua única coisa..."
        class="w-full max-w-xs bg-white/10 border border-accent/40 rounded-btn p-4 text-cream text-sm placeholder-muted resize-none focus:outline-none focus:border-accent"
        rows="3"
      ></textarea>
      <button
        type="button"
        (click)="submit()"
        [disabled]="loading()"
        class="w-full max-w-xs bg-accent text-cream rounded-btn py-3 font-bold text-sm hover:bg-accent-light transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        {{ loading() ? 'Salvando...' : 'Definir minha coisa' }}
      </button>
      <button
        type="button"
        (click)="skip()"
        [disabled]="loading()"
        class="text-muted text-xs hover:text-cream transition-colors disabled:opacity-40 disabled:pointer-events-none"
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
  displayName = computed(() => (this.user()?.displayName?.trim() ?? '') || null);
  intention = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  greeting = computed(() => {
    const hour = getHourInTimezone(this.user()?.timezone);
    if (hour >= 5 && hour < 12) return { text: 'Bom dia', emoji: '☀️' };
    if (hour >= 12 && hour < 18) return { text: 'Boa tarde', emoji: '🌤️' };
    return { text: 'Boa noite', emoji: '🌙' };
  });

  submit() {
    this.errorMessage.set(null);
    const text = this.intention.trim();
    if (!text) {
      this.errorMessage.set('Escreva qual é a sua única coisa hoje.');
      return;
    }
    this.loading.set(true);
    this.todaySvc.create(text).subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.message ?? 'Não foi possível salvar. Verifique a conexão e tente de novo.';
        this.errorMessage.set(msg);
      },
    });
  }

  skip() {
    this.errorMessage.set(null);
    this.loading.set(true);
    this.todaySvc.skip().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.message ?? 'Não foi possível pular. Tente de novo.';
        this.errorMessage.set(msg);
      },
    });
  }
}
