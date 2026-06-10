import { Injectable, signal } from '@angular/core';

import { CartItem } from '../models/cart.model';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly orders = signal<Order[]>([]);
  private simulationTimers = new Map<string, ReturnType<typeof setTimeout>[]>();

  readonly activeOrder = signal<Order | null>(null);

  createOrder(params: {
    storeId: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    loyaltyDiscount: number;
    total: number;
  }): Order {
    const order: Order = {
      id: crypto.randomUUID(),
      storeId: params.storeId,
      userId: params.userId,
      items: params.items,
      subtotal: params.subtotal,
      loyaltyDiscount: params.loyaltyDiscount,
      total: params.total,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };

    this.orders.update((list) => [...list, order]);
    this.activeOrder.set(order);

    return order;
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find((order) => order.id === orderId);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.orders.update((list) =>
      list.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

    const active = this.activeOrder();
    if (active?.id === orderId) {
      this.activeOrder.set({ ...active, status });
    }
  }

  setActiveOrder(orderId: string): void {
    const order = this.getOrderById(orderId);
    if (order) {
      this.activeOrder.set(order);
    }
  }

  startStatusSimulation(orderId: string): void {
    this.stopStatusSimulation(orderId);

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        this.updateOrderStatus(orderId, 'preparing');
      }, 4000)
    );

    timers.push(
      setTimeout(() => {
        this.updateOrderStatus(orderId, 'ready');
      }, 8000)
    );

    this.simulationTimers.set(orderId, timers);
  }

  stopStatusSimulation(orderId: string): void {
    const timers = this.simulationTimers.get(orderId);
    if (timers) {
      timers.forEach((timer) => clearTimeout(timer));
      this.simulationTimers.delete(orderId);
    }
  }
}
