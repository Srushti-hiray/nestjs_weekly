import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  processPayment(amount: number) {
    // Simulate payment processing
    if (amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    return { status: 'success', message: 'Payment processed' };
  }
}
