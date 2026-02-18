import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="min-h-screen bg-ink flex flex-col items-center justify-center gap-6">
      <div
        class="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin"
        aria-hidden="true"
      ></div>
      <p class="text-cream font-sans text-sm text-muted">Carregando...</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
