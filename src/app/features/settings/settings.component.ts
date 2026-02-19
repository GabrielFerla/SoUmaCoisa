import { Component, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';

const TIMEZONES = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Fortaleza',
  'America/Recife',
  'Europe/Lisbon',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
];

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-warm-white p-6">
      <h1 class="font-serif text-3xl font-bold text-ink mb-6">Configurações</h1>

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="max-w-md flex flex-col gap-4"
      >
        @if (successMessage()) {
          <p class="text-moss text-sm font-medium">{{ successMessage() }}</p>
        }
        @if (errorMessage()) {
          <p class="text-accent text-sm font-medium">{{ errorMessage() }}</p>
        }
        <div>
          <label for="displayName" class="block text-xs font-semibold text-ink uppercase tracking-widest mb-1">Nome</label>
          <input
            id="displayName"
            type="text"
            formControlName="displayName"
            placeholder="Seu nome"
            class="w-full bg-white border border-border rounded-btn px-4 py-3 text-ink text-sm placeholder-muted focus:outline-none focus:border-accent"
          />
          @if (form.get('displayName')?.invalid && form.get('displayName')?.touched) {
            <p class="text-accent text-xs mt-1">Nome obrigatório</p>
          }
        </div>
        <div>
          <label for="timezone" class="block text-xs font-semibold text-ink uppercase tracking-widest mb-1">Fuso horário</label>
          <select
            id="timezone"
            formControlName="timezone"
            class="w-full bg-white border border-border rounded-btn px-4 py-3 text-ink text-sm focus:outline-none focus:border-accent"
          >
            @for (tz of timezones; track tz) {
              <option [value]="tz">{{ tz }}</option>
            }
          </select>
        </div>
        <button
          type="submit"
          [disabled]="form.invalid || form.pristine || loading()"
          class="w-full max-w-xs bg-accent text-cream rounded-btn py-3 font-bold text-sm hover:bg-accent-light transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {{ loading() ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </form>

      <div class="mt-10 pt-6 border-t border-border">
        <button
          type="button"
          (click)="logout()"
          class="px-4 py-2 rounded-btn border border-accent text-accent font-semibold text-sm hover:bg-accent-pale transition-colors"
        >
          Sair da conta
        </button>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  timezones = TIMEZONES;

  form = this.fb.nonNullable.group({
    displayName: ['', Validators.required],
    timezone: ['America/Sao_Paulo'],
  });

  constructor() {
    effect(() => {
      const u = this.auth.currentUser();
      if (u) {
        this.form.patchValue(
          {
            displayName: u.displayName || '',
            timezone: u.timezone || 'America/Sao_Paulo',
          },
          { emitEvent: false }
        );
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    if (this.form.invalid) return;
    this.loading.set(true);
    const { displayName, timezone } = this.form.getRawValue();
    this.auth.updateProfile(displayName, timezone).subscribe({
      next: () => {
        this.loading.set(false);
        this.form.markAsPristine();
        this.successMessage.set('Alterações salvas.');
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.message ?? 'Não foi possível salvar. Tente de novo.';
        this.errorMessage.set(msg);
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
