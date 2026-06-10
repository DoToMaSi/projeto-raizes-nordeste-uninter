import { CartItem } from './cart.model';

export type OrderStatus = 'pending_payment' | 'received' | 'preparing' | 'ready' | 'cancelled';

export interface Order {
  id: string;
  storeId: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  loyaltyDiscount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
