import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NavbarComponent],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-warm-white flex items-center justify-center p-6">
      <p class="text-ink font-sans">Histórico (em construção)</p>
    </div>
  `,
})
export class HistoryComponent {}
