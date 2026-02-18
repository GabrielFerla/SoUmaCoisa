import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-warm-white flex flex-col items-center justify-center px-6">
      <h1 class="font-serif text-3xl font-bold text-ink mb-2">Entrar</h1>
      <p class="text-muted text-sm mb-6">Acesse sua conta Só Uma Coisa</p>

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="w-full max-w-xs flex flex-col gap-4"
      >
        @if (errorMessage()) {
          <p class="text-accent text-sm font-medium">{{ errorMessage() }}</p>
        }
        <div>
          <label for="email" class="block text-xs font-semibold text-ink uppercase tracking-widest mb-1">E-mail</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="seu@email.com"
            class="w-full bg-white border border-border rounded-btn px-4 py-3 text-ink text-sm placeholder-muted focus:outline-none focus:border-accent"
          />
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <p class="text-accent text-xs mt-1">E-mail obrigatório</p>
          }
        </div>
        <div>
          <label for="password" class="block text-xs font-semibold text-ink uppercase tracking-widest mb-1">Senha</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="••••••••"
            class="w-full bg-white border border-border rounded-btn px-4 py-3 text-ink text-sm placeholder-muted focus:outline-none focus:border-accent"
          />
          @if (form.get('password')?.invalid && form.get('password')?.touched) {
            <p class="text-accent text-xs mt-1">Senha obrigatória</p>
          }
        </div>
        <button
          type="submit"
          [disabled]="loading()"
          class="w-full bg-accent text-cream rounded-btn py-3 font-bold text-sm hover:bg-accent-light transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {{ loading() ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-6 text-muted text-sm">
        Não tem conta?
        <a routerLink="/auth/register" class="text-accent font-semibold hover:underline">Registrar</a>
      </p>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage.set('Preencha e-mail e senha corretamente.');
      return;
    }
    this.errorMessage.set(null);
    this.loading.set(true);
    this.auth
      .login(this.form.getRawValue().email, this.form.getRawValue().password)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loading.set(false);
          const msg = err?.error?.message ?? err?.message ?? 'E-mail ou senha inválidos.';
          this.errorMessage.set(msg);
        },
      });
  }
}
