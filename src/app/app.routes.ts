import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/today/today.routes').then((m) => m.TODAY_ROUTES),
  },
  {
    path: 'history',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/history/history.routes').then((m) => m.HISTORY_ROUTES),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/settings/settings.routes').then(
        (m) => m.SETTINGS_ROUTES
      ),
  },
  { path: '**', redirectTo: 'home' },
];
