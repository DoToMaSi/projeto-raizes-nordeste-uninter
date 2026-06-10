import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaymentResult, PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-payment-gateway',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6">
      <div class="rounded-box border-base-300 w-full border-2 bg-neutral p-8 text-neutral-content shadow-2xl">
        <div class="mb-6 text-center">
          <p class="text-sm uppercase tracking-widest opacity-70">Gateway Externo</p>
          <h1 class="text-2xl font-bold">PagSeguro Mock</h1>
          <p class="mt-2 text-sm opacity-80">Pedido #{{ orderId()?.slice(0, 8) }}</p>
        </div>

        @if (processing()) {
          <div class="flex flex-col items-center gap-4 py-8">
            <span class="loading loading-spinner loading-lg"></span>
            <p>Processando pagamento...</p>
            <p class="text-xs opacity-60">Aguarde 3 segundos</p>
          </div>
        } @else {
          <p class="mb-6 text-center text-sm">Simule o resultado do pagamento:</p>
          <div class="flex flex-col gap-3">
            <button type="button" class="btn btn-success min-h-11 w-full" (click)="process('success')">
              Aprovar pagamento
            </button>
            <button type="button" class="btn btn-error min-h-11 w-full" (click)="process('failure')">
              Recusar pagamento
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class PaymentGatewayComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentService = inject(PaymentService);

  protected readonly orderId = signal<string | null>(null);
  protected readonly processing = signal(false);
  private autoProcessed = false;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (!orderId) {
      void this.router.navigate(['/checkout']);
      return;
    }

    this.orderId.set(orderId);

    setTimeout(() => {
      if (!this.autoProcessed) {
        void this.process('success');
      }
    }, 3000);
  }

  async process(result: PaymentResult): Promise<void> {
    const orderId = this.orderId();
    if (!orderId || this.processing()) {
      return;
    }

    this.autoProcessed = true;
    this.processing.set(true);

    await this.paymentService.requestPayment(orderId, result);

    void this.router.navigate(['/pagamento', orderId, 'callback'], {
      queryParams: { result }
    });
  }
}
