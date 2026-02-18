import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { User, AuthResponse } from '../models/user.model';

const TOKEN_KEY = 'suc_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    if (isPlatformBrowser(this.platformId) && this.getToken()) this.fetchMe();
  }

  register(displayName: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, {
        displayName,
        email,
        password,
      })
      .pipe(tap((r) => this.handleAuth(r)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, {
        email,
        password,
      })
      .pipe(tap((r) => this.handleAuth(r)));
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuth(res: AuthResponse) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, res.token);
    }
    this.currentUser.set(res.user);
  }

  private fetchMe() {
    this.http.get<User>(`${environment.apiUrl}/api/me`).subscribe({
      next: (u) => this.currentUser.set(u),
      error: () => this.logout(),
    });
  }
}
