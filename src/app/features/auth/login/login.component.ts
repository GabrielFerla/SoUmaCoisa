import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-warm-white flex items-center justify-center p-6">
      <p class="text-ink font-sans">Login (em construção)</p>
      <a routerLink="/auth/register" class="text-accent ml-2">Registrar</a>
    </div>
  `,
})
export class LoginComponent {}
