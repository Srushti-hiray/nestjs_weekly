import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  processPayment(@Body() body: { amount: number }) {
    return this.paymentService.processPayment(body.amount);
  }
}
