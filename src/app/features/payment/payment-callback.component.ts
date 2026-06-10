import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PaymentResult } from '../../core/services/payment.service';

@Component({
  selector: 'app-payment-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hero min-h-96">
      <div class="hero-content text-center">
        @if (success) {
          <div>
            <div class="text-success text-5xl">✓</div>
            <h1 class="text-2xl font-bold">Pagamento aprovado!</h1>
            <p class="py-4">Redirecionando para acompanhamento do pedido...</p>
            <span class="loading loading-spinner loading-md"></span>
          </div>
        } @else {
          <div>
            <div class="text-error text-5xl">✗</div>
            <h1 class="text-2xl font-bold">Pagamento recusado</h1>
            <p class="py-4">Voltando ao checkout...</p>
            <span class="loading loading-spinner loading-md"></span>
          </div>
        }
      </div>
    </div>
  `
})
export class PaymentCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly cartService = inject(CartService);

  protected success = false;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    const result = this.route.snapshot.queryParamMap.get('result') as PaymentResult | null;

    if (!orderId || !result) {
      void this.router.navigate(['/checkout']);
      return;
    }

    this.success = result === 'success';

    if (this.success) {
      this.orderService.updateOrderStatus(orderId, 'received');
      this.orderService.setActiveOrder(orderId);
      this.orderService.startStatusSimulation(orderId);
      this.cartService.clear();

      setTimeout(() => {
        void this.router.navigate(['/pedido', orderId]);
      }, 2000);
    } else {
      this.orderService.updateOrderStatus(orderId, 'cancelled');

      setTimeout(() => {
        void this.router.navigate(['/checkout']);
      }, 2000);
    }
  }
}
