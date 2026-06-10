import { inject, Injectable, signal } from '@angular/core';

import { Store } from '../models/store.model';

const SELECTED_STORE_KEY = 'raizes_selected_store';

@Injectable({ providedIn: 'root' })
export class StoreService {
  readonly selectedStore = signal<Store | null>(this.loadStore());

  selectStore(store: Store): void {
    this.selectedStore.set(store);
    localStorage.setItem(SELECTED_STORE_KEY, JSON.stringify(store));
  }

  clearStore(): void {
    this.selectedStore.set(null);
    localStorage.removeItem(SELECTED_STORE_KEY);
  }

  private loadStore(): Store | null {
    const stored = localStorage.getItem(SELECTED_STORE_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as Store;
    } catch {
      return null;
    }
  }
}
