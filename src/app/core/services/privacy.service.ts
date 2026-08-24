import { inject, Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { LgpdService } from './lgpd.service';
import { MockApiService } from './mock-api.service';
import { OrderService } from './order.service';
import { StoreService } from './store.service';

const SESSION_KEY = 'raizes_session';
const LGPD_CONSENT_KEY = 'raizes_lgpd_consent';
const SELECTED_STORE_KEY = 'raizes_selected_store';

@Injectable({ providedIn: 'root' })
export class PrivacyService {
  private readonly authService = inject(AuthService);
  private readonly lgpdService = inject(LgpdService);
  private readonly storeService = inject(StoreService);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly mockApi = inject(MockApiService);

  clearAllSavedData(): void {
    const email = this.authService.currentUser()?.email;

    if (email) {
      this.mockApi.removeRegisteredUserByEmail(email);
    }

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LGPD_CONSENT_KEY);
    localStorage.removeItem(SELECTED_STORE_KEY);

    this.authService.clearSession();
    this.lgpdService.clearConsent();
    this.storeService.clearStore();
    this.cartService.clear();
    this.orderService.clearAll();
  }
}
