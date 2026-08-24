import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Promotion } from '../models/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionsService {
  private readonly http = inject(HttpClient);

  readonly promotions = signal<Promotion[]>([]);
  readonly loading = signal(false);

  async loadPromotions(): Promise<void> {
    this.loading.set(true);

    try {
      const all = await firstValueFrom(this.http.get<Promotion[]>('assets/mock/promotions.json'));
      this.promotions.set(all);
    } finally {
      this.loading.set(false);
    }
  }

  getPromotionsForStore(storeId: string | null): Promotion[] {
    if (!storeId) {
      return this.promotions();
    }

    return this.promotions().filter((promo) => promo.storeIds.includes(storeId));
  }
}
