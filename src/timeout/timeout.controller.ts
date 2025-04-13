import { Controller, Get } from '@nestjs/common';
import { TimeoutService } from './timeout.service';

@Controller('timeout')
export class TimeoutController {
  constructor(private readonly timeoutService: TimeoutService) {}

  @Get()
  async testTimeout() {
    return this.timeoutService.longRunningTask();
  }
}
