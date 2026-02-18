import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-warm-white flex items-center justify-center p-6">
      <p class="text-ink font-sans">Registro (em construção)</p>
      <a routerLink="/auth/login" class="text-accent ml-2">Login</a>
    </div>
  `,
})
export class RegisterComponent {}
