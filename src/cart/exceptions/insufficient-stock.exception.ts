// src/cart/exceptions/insufficient-stock.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientStockException extends HttpException {
  constructor() {
    super('Insufficient stock for the requested item', HttpStatus.BAD_REQUEST);
  }
}
