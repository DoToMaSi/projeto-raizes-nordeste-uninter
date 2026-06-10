import { inject, Injectable, signal, computed } from '@angular/core';

import { UserSession } from '../models/user.model';
import { MockApiService } from './mock-api.service';

const SESSION_KEY = 'raizes_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly mockApi = inject(MockApiService);

  readonly currentUser = signal<UserSession | null>(this.loadSession());

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  async login(email: string, password: string): Promise<boolean> {
    const user = await this.mockApi.login(email, password);
    if (!user) {
      return false;
    }

    this.setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      loyaltyPoints: user.loyaltyPoints
    });

    return true;
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    if (await this.mockApi.emailExists(email)) {
      return false;
    }

    const user = await this.mockApi.register({ name, email, password });
    this.setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      loyaltyPoints: user.loyaltyPoints
    });

    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  updateLoyaltyPoints(points: number): void {
    const session = this.currentUser();
    if (!session) {
      return;
    }

    this.setSession({ ...session, loyaltyPoints: points });
  }

  private setSession(session: UserSession): void {
    this.currentUser.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private loadSession(): UserSession | null {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as UserSession;
    } catch {
      return null;
    }
  }
}
