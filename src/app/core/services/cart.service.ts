import { Injectable, signal, computed } from '@angular/core';

import { CartItem } from '../models/cart.model';
import { MenuProduct, ProductOption } from '../models/product.model';

export interface AddToCartPayload {
  product: MenuProduct;
  size: ProductOption;
  addons: ProductOption[];
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);

  readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  );

  addItem(payload: AddToCartPayload): void {
    const addonPrice = payload.addons.reduce((total, addon) => total + addon.price, 0);
    const unitPrice = payload.product.price + payload.size.price + addonPrice;

    const newItem: CartItem = {
      id: crypto.randomUUID(),
      productId: payload.product.id,
      productName: payload.product.name,
      sizeId: payload.size.id,
      sizeName: payload.size.name,
      addonIds: payload.addons.map((addon) => addon.id),
      addonNames: payload.addons.map((addon) => addon.name),
      unitPrice,
      quantity: payload.quantity
    };

    this.items.update((items) => [...items, newItem]);
  }

  removeItem(itemId: string): void {
    this.items.update((items) => items.filter((item) => item.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(itemId);
      return;
    }

    this.items.update((items) =>
      items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  }

  clear(): void {
    this.items.set([]);
  }
}
