import { Injectable } from '@nestjs/common';
import { Timeout } from './timeout.decorator';

@Injectable()
export class TimeoutService {
  @Timeout(5000) // 5 seconds timeout
  async longRunningTask(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Task completed after 10 seconds');
      }, 10000); // Simulate long task (10 seconds)
    });
  }
}
