import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { OrderStatus } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';

interface OrderStep {
  status: OrderStatus;
  label: string;
  description: string;
}

const ORDER_STEPS: OrderStep[] = [
  { status: 'received', label: 'Recebido', description: 'Pedido confirmado' },
  { status: 'preparing', label: 'Cozinha', description: 'Preparando seu pedido' },
  { status: 'ready', label: 'Pronto', description: 'Disponível para retirada' }
];

@Component({
  selector: 'app-order-tracking',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    @if (order(); as currentOrder) {
      <div class="flex flex-col gap-6">
        <div>
          <h1 class="text-2xl font-bold">Acompanhar pedido</h1>
          <p class="text-base-content/70 text-sm">
            Pedido #{{ currentOrder.id.slice(0, 8) }} ·
            {{ currentOrder.createdAt | date: 'dd/MM/yyyy HH:mm' }}
          </p>
        </div>

        <ul class="steps steps-vertical w-full sm:steps-horizontal">
          @for (step of steps; track step.status) {
            <li class="step" [class.step-primary]="isStepComplete(step.status)">
              <div class="text-left sm:text-center">
                <span class="font-semibold">{{ step.label }}</span>
                <p class="text-base-content/60 text-xs">{{ step.description }}</p>
              </div>
            </li>
          }
        </ul>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Detalhes</h2>
            @for (item of currentOrder.items; track item.id) {
              <div class="flex justify-between text-sm">
                <span>{{ item.quantity }}x {{ item.productName }}</span>
                <span>{{ item.unitPrice * item.quantity | currency: 'BRL' }}</span>
              </div>
            }
            <div class="divider my-1"></div>
            <div class="flex justify-between font-bold">
              <span>Total pago</span>
              <span>{{ currentOrder.total | currency: 'BRL' }}</span>
            </div>
          </div>
        </div>

        @if (currentOrder.status === 'ready') {
          <div class="alert alert-success">
            <span>Seu pedido está pronto para retirada!</span>
          </div>
        }

        <a routerLink="/cardapio" class="btn btn-primary min-h-11 w-fit">Fazer novo pedido</a>
      </div>
    } @else {
      <div class="hero min-h-64">
        <div class="hero-content text-center">
          <h2 class="text-xl font-semibold">Pedido não encontrado</h2>
          <a routerLink="/cardapio" class="btn btn-primary mt-4 min-h-11">Ver cardápio</a>
        </div>
      </div>
    }
  `
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  protected readonly steps = ORDER_STEPS;
  protected readonly order = signal(this.orderService.activeOrder());

  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId) {
      this.orderService.setActiveOrder(orderId);
      this.order.set(this.orderService.getOrderById(orderId) ?? null);

      if (this.order()?.status === 'received') {
        this.orderService.startStatusSimulation(orderId);
      }
    }

    this.refreshInterval = setInterval(() => {
      const orderId = this.route.snapshot.paramMap.get('orderId');
      if (orderId) {
        this.order.set(this.orderService.getOrderById(orderId) ?? null);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  isStepComplete(stepStatus: OrderStatus): boolean {
    const current = this.order()?.status;
    if (!current) {
      return false;
    }

    const statusOrder: OrderStatus[] = ['pending_payment', 'received', 'preparing', 'ready'];
    const currentIndex = statusOrder.indexOf(current);
    const stepIndex = statusOrder.indexOf(stepStatus);

    return currentIndex >= stepIndex;
  }
}
