import { Controller, Get, Post,Delete, Body } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addItemToCart(@Body() body: { productId: number; quantity: number }) {
    return this.cartService.addItemToCart(body.productId, body.quantity);
  }

  @Get()
  getCartItems() {
    return this.cartService.getCartItems();
  }

  @Delete() // 👈 Clear cart endpoint
  clearCart() {
    this.cartService.clearCart();
    return { message: 'Cart cleared successfully' };
  }
}
