import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-warm-white flex flex-col items-center justify-center px-6">
      <h1 class="font-serif text-3xl font-bold text-ink mb-2">Criar conta</h1>
      <p class="text-muted text-sm mb-6">Cadastre-se no Só Uma Coisa</p>

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="w-full max-w-xs flex flex-col gap-4"
      >
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
            <p class="text-accent text-xs mt-1">Senha obrigatória (mín. 6 caracteres)</p>
          }
        </div>
        <button
          type="submit"
          [disabled]="form.invalid || loading()"
          class="w-full bg-accent text-cream rounded-btn py-3 font-bold text-sm hover:bg-accent-light transition-colors disabled:opacity-40"
        >
          {{ loading() ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
      </form>

      <p class="mt-6 text-muted text-sm">
        Já tem conta?
        <a routerLink="/auth/login" class="text-accent font-semibold hover:underline">Entrar</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.errorMessage.set(null);
    this.loading.set(true);
    const { displayName, email, password } = this.form.getRawValue();
    this.auth.register(displayName, email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.message ?? 'Não foi possível cadastrar. Tente outro e-mail.';
        this.errorMessage.set(msg);
      },
    });
  }
}
