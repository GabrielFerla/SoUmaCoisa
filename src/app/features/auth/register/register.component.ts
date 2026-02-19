import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-warm-white flex items-center justify-center w-full px-4 py-8">
      <div class="w-full max-w-md">
        <div class="border border-border rounded-card bg-cream/30 shadow-card p-8">
          <h1 class="font-serif text-3xl font-bold text-ink mb-2 text-center">Criar conta</h1>
          <p class="text-muted text-sm mb-6 text-center">Cadastre-se no Só Uma Coisa</p>

          <form
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            class="flex flex-col gap-4"
          >
            @if (errorMessage()) {
              <p class="text-accent text-sm font-medium text-center">{{ errorMessage() }}</p>
            }
            <div>
              <label for="displayName" class="block text-xs font-semibold text-ink uppercase tracking-widest mb-1">Nome</label>
              <input
                id="displayName"
                type="text"
                formControlName="displayName"
                placeholder="Seu nome"
                class="w-full bg-warm-white border border-border rounded-btn px-4 py-3 text-ink text-base placeholder-muted focus:outline-none focus:border-accent"
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
                class="w-full bg-warm-white border border-border rounded-btn px-4 py-3 text-ink text-base placeholder-muted focus:outline-none focus:border-accent"
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
                placeholder="Mín. 6 caracteres"
                class="w-full bg-warm-white border border-border rounded-btn px-4 py-3 text-ink text-base placeholder-muted focus:outline-none focus:border-accent"
              />
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <p class="text-accent text-xs mt-1">Senha obrigatória (mín. 6 caracteres)</p>
              }
            </div>
            <button
              type="submit"
              [disabled]="loading()"
              class="mt-2 w-full bg-accent text-cream rounded-btn py-3 font-bold text-sm hover:bg-accent-light transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {{ loading() ? 'Cadastrando...' : 'Cadastrar' }}
            </button>
          </form>
        </div>

        <p class="mt-5 text-center text-muted text-sm">
          Já tem conta?
          <a routerLink="/auth/login" class="text-accent font-semibold hover:underline">Entrar</a>
        </p>
      </div>
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
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage.set('Preencha nome, e-mail e senha (mín. 6 caracteres).');
      return;
    }
    this.errorMessage.set(null);
    this.loading.set(true);
    const { displayName, email, password } = this.form.getRawValue();
    this.auth.register(displayName, email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.message ?? 'Não foi possível cadastrar. Tente outro e-mail.';
        this.errorMessage.set(msg);
      },
    });
  }
}
