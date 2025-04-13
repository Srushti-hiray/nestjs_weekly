import { Injectable } from '@nestjs/common';

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: string;
}

@Injectable()
export class OrderService {
  private orders: Order[] = []; // ✅ Strongly typed

  createOrder(cartItems: CartItem[]): Order {
    const order: Order = {
      id: Math.random().toString(36).substring(7),
      items: cartItems,
      status: 'Confirmed',
    };
    this.orders.push(order);
    return order;
  }

  getOrders(): Order[] {
    return this.orders;
  }
}
