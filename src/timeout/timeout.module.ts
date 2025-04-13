import { Module } from '@nestjs/common';
import { TimeoutController } from './timeout.controller';
import { TimeoutService } from './timeout.service';

@Module({
  controllers: [TimeoutController],
  providers: [TimeoutService],
  exports: [TimeoutService],
})
export class TimeoutModule {}
