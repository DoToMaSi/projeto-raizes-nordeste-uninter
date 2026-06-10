import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">Carrinho</h1>

      @if (cartService.items().length === 0) {
        <div class="hero bg-base-200 min-h-64 rounded-box">
          <div class="hero-content text-center">
            <div>
              <h2 class="text-xl font-semibold">Seu carrinho está vazio</h2>
              <p class="py-4">Explore o cardápio e adicione seus favoritos</p>
              <a routerLink="/cardapio" class="btn btn-primary min-h-11">Ver cardápio</a>
            </div>
          </div>
        </div>
      } @else {
        <div class="flex flex-col gap-4">
          @for (item of cartService.items(); track item.id) {
            <div class="card bg-base-100 shadow-md">
              <div class="card-body flex-row flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 class="font-semibold">{{ item.productName }}</h3>
                  <p class="text-base-content/70 text-sm">
                    {{ item.sizeName }}
                    @if (item.addonNames.length > 0) {
                      · {{ item.addonNames.join(', ') }}
                    }
                  </p>
                  <p class="text-primary font-medium">{{ item.unitPrice | currency: 'BRL' }} cada</p>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-circle min-h-11 min-w-11"
                    (click)="cartService.updateQuantity(item.id, item.quantity - 1)"
                  >
                    −
                  </button>
                  <span class="min-w-8 text-center font-semibold">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="btn btn-sm btn-circle min-h-11 min-w-11"
                    (click)="cartService.updateQuantity(item.id, item.quantity + 1)"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm text-error min-h-11"
                    (click)="cartService.removeItem(item.id)"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{{ cartService.subtotal() | currency: 'BRL' }}</span>
            </div>
            <div class="card-actions justify-end">
              <a routerLink="/cardapio" class="btn btn-outline min-h-11">Continuar comprando</a>
              <a routerLink="/checkout" class="btn btn-primary min-h-11">Finalizar pedido</a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CartPageComponent {
  protected readonly cartService = inject(CartService);
}
