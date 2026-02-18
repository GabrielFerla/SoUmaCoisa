import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-warm-white border-b border-border">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-center gap-6">
        <a
          routerLink="/home"
          routerLinkActive="text-accent font-semibold"
          [routerLinkActiveOptions]="{ exact: false }"
          class="text-ink font-sans text-sm hover:text-accent transition-colors"
        >
          Hoje
        </a>
        <a
          routerLink="/history"
          routerLinkActive="text-accent font-semibold"
          class="text-ink font-sans text-sm hover:text-accent transition-colors"
        >
          Histórico
        </a>
        <a
          routerLink="/settings"
          routerLinkActive="text-accent font-semibold"
          class="text-ink font-sans text-sm hover:text-accent transition-colors"
        >
          Configurações
        </a>
      </div>
    </nav>
  `,
})
export class NavbarComponent {}
