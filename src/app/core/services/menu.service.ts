import { inject, Injectable, signal, computed } from '@angular/core';

import { MenuCategory, MenuProduct, ProductCategory } from '../models/product.model';
import { MockApiService } from './mock-api.service';
import { StoreService } from './store.service';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  tapiocas: 'Tapiocas',
  cuscuz: 'Cuscuz',
  bebidas: 'Bebidas'
};

const CATEGORY_ORDER: ProductCategory[] = ['tapiocas', 'cuscuz', 'bebidas'];

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly mockApi = inject(MockApiService);
  private readonly storeService = inject(StoreService);

  readonly products = signal<MenuProduct[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly categories = computed<MenuCategory[]>(() => {
    const grouped = new Map<ProductCategory, MenuProduct[]>();

    for (const product of this.products()) {
      const list = grouped.get(product.category) ?? [];
      list.push(product);
      grouped.set(product.category, list);
    }

    return CATEGORY_ORDER.filter((category) => grouped.has(category)).map((category) => ({
      id: category,
      label: CATEGORY_LABELS[category],
      products: grouped.get(category) ?? []
    }));
  });

  async loadMenuForSelectedStore(): Promise<void> {
    const store = this.storeService.selectedStore();
    if (!store) {
      this.products.set([]);
      return;
    }

    await this.loadMenuForStore(store.id);
  }

  async loadMenuForStore(storeId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.mockApi.getMenuByStoreId(storeId);
      this.products.set(result?.products ?? []);

      if (!result) {
        this.error.set('Cardápio não encontrado para esta loja.');
      }
    } catch {
      this.error.set('Erro ao carregar o cardápio.');
      this.products.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  getProductById(productId: string): MenuProduct | undefined {
    return this.products().find((product) => product.id === productId);
  }
}
