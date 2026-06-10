import { inject, Injectable, computed } from '@angular/core';

import { AuthService } from './auth.service';

export const POINTS_PER_REAL = 100;

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  private readonly authService = inject(AuthService);

  readonly points = computed(() => this.authService.currentUser()?.loyaltyPoints ?? 0);

  readonly maxDiscount = computed(() => this.pointsToDiscount(this.points()));

  pointsToDiscount(points: number): number {
    return Math.floor(points / POINTS_PER_REAL);
  }

  discountToPoints(discount: number): number {
    return discount * POINTS_PER_REAL;
  }

  applyPointsDiscount(discountAmount: number): void {
    const pointsUsed = this.discountToPoints(discountAmount);
    const remaining = this.points() - pointsUsed;
    this.authService.updateLoyaltyPoints(Math.max(0, remaining));
  }
}
