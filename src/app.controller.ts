import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { IsEvenPipe } from './pipe/is-even-pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/check-even/:num')
  checkEven(@Param('num', IsEvenPipe) num: number) {
    return { message: `${num} is even!` };
  }
}
