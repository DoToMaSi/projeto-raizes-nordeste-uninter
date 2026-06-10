import { Injectable } from '@angular/core';

export type PaymentResult = 'success' | 'failure';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly delayMs = 3000;

  requestPayment(orderId: string, result: PaymentResult = 'success'): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), this.delayMs);
    });
  }
}
