import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { LoyaltyService } from '../../core/services/loyalty.service';
import { OrderService } from '../../core/services/order.service';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold">Checkout</h1>

      @if (cartService.items().length === 0) {
        <div class="alert alert-warning">
          <span>Seu carrinho está vazio.</span>
        </div>
        <a routerLink="/cardapio" class="btn btn-primary min-h-11 w-fit">Ver cardápio</a>
      } @else {
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Resumo do pedido</h2>
              @for (item of cartService.items(); track item.id) {
                <div class="flex justify-between text-sm">
                  <span>{{ item.quantity }}x {{ item.productName }}</span>
                  <span>{{ item.unitPrice * item.quantity | currency: 'BRL' }}</span>
                </div>
              }
              <div class="divider my-1"></div>
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ cartService.subtotal() | currency: 'BRL' }}</span>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body gap-4">
              <h2 class="card-title">Programa de fidelidade</h2>
              <p class="text-sm">
                Você possui
                <span class="font-bold text-primary">{{ loyaltyService.points() }} pontos</span>
                (até {{ loyaltyService.maxDiscount() | currency: 'BRL' }} de desconto)
              </p>

              <label class="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  class="toggle toggle-primary min-h-11 min-w-11"
                  [checked]="applyPoints()"
                  [disabled]="loyaltyService.maxDiscount() === 0"
                  (change)="togglePoints($event)"
                />
                <span class="label-text">Usar pontos para desconto</span>
              </label>

              @if (applyPoints()) {
                <p class="text-success text-sm">
                  Desconto aplicado: −{{ loyaltyDiscount() | currency: 'BRL' }}
                </p>
              }

              <div class="divider my-1"></div>

              <div class="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{{ total() | currency: 'BRL' }}</span>
              </div>

              @if (errorMessage()) {
                <p class="text-error text-sm">{{ errorMessage() }}</p>
              }

              <button
                type="button"
                class="btn btn-primary min-h-11 w-full"
                [disabled]="processing()"
                (click)="pay()"
              >
                @if (processing()) {
                  <span class="loading loading-spinner loading-sm"></span>
                }
                Pagar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CheckoutComponent {
  protected readonly cartService = inject(CartService);
  protected readonly loyaltyService = inject(LoyaltyService);
  private readonly authService = inject(AuthService);
  private readonly storeService = inject(StoreService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly applyPoints = signal(false);
  protected readonly processing = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly loyaltyDiscount = computed(() => {
    if (!this.applyPoints()) {
      return 0;
    }

    return Math.min(this.loyaltyService.maxDiscount(), this.cartService.subtotal());
  });

  protected readonly total = computed(() =>
    Math.max(0, this.cartService.subtotal() - this.loyaltyDiscount())
  );

  togglePoints(event: Event): void {
    this.applyPoints.set((event.target as HTMLInputElement).checked);
  }

  async pay(): Promise<void> {
    const user = this.authService.currentUser();
    const store = this.storeService.selectedStore();

    if (!user || !store || this.cartService.items().length === 0) {
      this.errorMessage.set('Não foi possível processar o pedido.');
      return;
    }

    this.processing.set(true);
    this.errorMessage.set(null);

    const discount = this.loyaltyDiscount();
    const order = this.orderService.createOrder({
      storeId: store.id,
      userId: user.userId,
      items: this.cartService.items(),
      subtotal: this.cartService.subtotal(),
      loyaltyDiscount: discount,
      total: this.total()
    });

    if (this.applyPoints() && discount > 0) {
      this.loyaltyService.applyPointsDiscount(discount);
    }

    await this.router.navigate(['/pagamento', order.id, 'aguardando']);
    this.processing.set(false);
  }
}
