// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { InsufficientStockException } from './exceptions/insufficient-stock.exception';

export interface CartItem {
  productId: number;
  quantity: number;
}

@Injectable()
export class CartService {
  private cartItems: CartItem[] = []; // Define cartItems as an array of CartItem objects
  private stock = {
    1: 10, // 10 items of product with ID 1
    2: 5,  // 5 items of product with ID 2
  };

  addItemToCart(productId: number, quantity: number): CartItem[] {
    // Check if there is enough stock
    if (this.stock[productId] < quantity) {
      throw new InsufficientStockException(); // Throw custom exception if insufficient stock
    }
    // Add the item to the cart
    this.cartItems.push({ productId, quantity });
    return this.cartItems;
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
