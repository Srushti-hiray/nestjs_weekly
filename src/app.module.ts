import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module'; 

import { TimeoutModule } from './timeout/timeout.module';
import { RateLimiterMiddleware } from './middleware/rate-limiter-middleware';


import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { UserdtoModule } from './userdto/userdto.module';
import { UsereduModule } from './education_dto/useredu.module';
import { EmploymentModule } from './employment/employment.module';

@Module({
  imports: [
    UsersModule,
    TimeoutModule,
    CartModule,    
    OrderModule,    
    PaymentModule, 
    UserdtoModule ,
    UsereduModule,
    EmploymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the RateLimiterMiddleware only for the /check-even/:num route
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('check-even/:num'); // Route stays untouched
  }
}
