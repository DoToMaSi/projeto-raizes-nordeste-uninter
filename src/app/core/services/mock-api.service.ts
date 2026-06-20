import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MenuProduct, Product, StoreMenu } from '../models/product.model';
import { Store } from '../models/store.model';
import { User } from '../models/user.model';

const REGISTERED_USERS_KEY = 'raizes_registered_users';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  private readonly http = inject(HttpClient);

  private readonly registeredUsers = signal<User[]>(this.loadRegisteredUsers());

  async getStores(): Promise<Store[]> {
    return firstValueFrom(this.http.get<Store[]>('assets/mock/stores.json'));
  }

  async getProducts(): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>('assets/mock/products.json'));
  }

  async getMenus(): Promise<StoreMenu[]> {
    return firstValueFrom(this.http.get<StoreMenu[]>('assets/mock/menus.json'));
  }

  async getMenuByStoreId(storeId: string): Promise<{ products: MenuProduct[]; menu: StoreMenu } | null> {
    const [products, menus] = await Promise.all([this.getProducts(), this.getMenus()]);
    const menu = menus.find((entry) => entry.storeId === storeId);

    if (!menu) {
      return null;
    }

    const pricedProducts = menu.items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return product ? { ...product, price: item.price } : null;
      })
      .filter((product): product is MenuProduct => product !== null);

    return { products: pricedProducts, menu };
  }

  async emailExists(email: string): Promise<boolean> {
    const seedUsers = await firstValueFrom(this.http.get<User[]>('assets/mock/users.json'));
    const allUsers = [...seedUsers, ...this.registeredUsers()];
    return allUsers.some((entry) => entry.email.toLowerCase() === email.toLowerCase());
  }

  async login(email: string, password: string): Promise<User | null> {
    const seedUsers = await firstValueFrom(this.http.get<User[]>('assets/mock/users.json'));
    const allUsers = [...seedUsers, ...this.registeredUsers()];
    const user = allUsers.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password
    );

    return user ?? null;
  }

  async register(user: Omit<User, 'id' | 'loyaltyPoints'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      loyaltyPoints: 100
    };

    this.registeredUsers.update((users) => [...users, newUser]);
    this.persistRegisteredUsers(this.registeredUsers());

    return newUser;
  }

  findRegisteredUserByEmail(email: string): User | undefined {
    return this.registeredUsers().find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase()
    );
  }

  private loadRegisteredUsers(): User[] {
    const stored = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as User[];
    } catch {
      return [];
    }
  }

  private persistRegisteredUsers(users: User[]): void {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }
}
