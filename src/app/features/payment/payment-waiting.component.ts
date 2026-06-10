import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-payment-waiting',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hero min-h-96">
      <div class="hero-content text-center">
        <div>
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <h1 class="mt-4 text-2xl font-bold">Aguardando pagamento</h1>
          <p class="py-4">Redirecionando para o gateway de pagamento...</p>
        </div>
      </div>
    </div>
  `
})
export class PaymentWaitingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentService = inject(PaymentService);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (!orderId) {
      void this.router.navigate(['/checkout']);
      return;
    }

    setTimeout(() => {
      void this.router.navigate(['/pagamento', orderId, 'gateway']);
    }, 1500);
  }
}
