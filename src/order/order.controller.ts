import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrderService,CartItem } from './order.service';
//import { order } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: { cartItems: CartItem[] }) {
    return this.orderService.createOrder(body.cartItems);
  }

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
}
