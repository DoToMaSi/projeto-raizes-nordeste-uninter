import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MenuProduct } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { MenuService } from '../../core/services/menu.service';
import { StoreService } from '../../core/services/store.service';
import { ProductCustomizeComponent } from './product-customize.component';

@Component({
  selector: 'app-menu-browse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, ProductCustomizeComponent],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold">Cardápio</h1>
          @if (storeService.selectedStore(); as store) {
            <p class="text-base-content/70 text-sm">{{ store.name }} · {{ store.city }}</p>
          }
        </div>
        <a routerLink="/loja" class="btn btn-outline min-h-11">Trocar loja</a>
      </div>

      @if (menuService.loading()) {
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else if (menuService.error(); as error) {
        <div class="alert alert-error">
          <span>{{ error }}</span>
        </div>
      } @else {
        @for (category of menuService.categories(); track category.id) {
          <section>
            <h2 class="mb-4 text-xl font-semibold">{{ category.label }}</h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              @for (product of category.products; track product.id) {
                <div class="card bg-base-100 shadow-xl">
                  <div class="card-body">
                    <h3 class="card-title text-base">{{ product.name }}</h3>
                    <p class="text-base-content/70 text-sm">{{ product.description }}</p>
                    <p class="text-primary font-bold">{{ product.price | currency: 'BRL' }}</p>
                    <div class="card-actions justify-end">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm min-h-11"
                        (click)="openCustomize(product)"
                      >
                        Personalizar
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      }
    </div>

    @if (selectedProduct(); as product) {
      <app-product-customize
        [product]="product"
        (confirmed)="onAddToCart($event)"
        (cancelled)="closeCustomize()"
      />
    }
  `
})
export class MenuBrowseComponent implements OnInit {
  protected readonly menuService = inject(MenuService);
  protected readonly storeService = inject(StoreService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly selectedProduct = signal<MenuProduct | null>(null);

  async ngOnInit(): Promise<void> {
    if (this.menuService.products().length === 0) {
      await this.menuService.loadMenuForSelectedStore();
    }
  }

  openCustomize(product: MenuProduct): void {
    this.selectedProduct.set(product);
  }

  closeCustomize(): void {
    this.selectedProduct.set(null);
  }

  onAddToCart(payload: {
    size: MenuProduct['sizes'][number];
    addons: MenuProduct['addons'];
    quantity: number;
  }): void {
    const product = this.selectedProduct();
    if (!product) {
      return;
    }

    this.cartService.addItem({
      product,
      size: payload.size,
      addons: payload.addons,
      quantity: payload.quantity
    });

    this.closeCustomize();
    void this.router.navigate(['/carrinho']);
  }
}
