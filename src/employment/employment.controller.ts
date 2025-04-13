import { 
    Controller, 
    Post, 
    Body, 
    Headers, 
    UsePipes, 
    ValidationPipe 
  } from '@nestjs/common';
  import { EmploymentService } from './employment.service';
  
  @Controller('employment')
  export class EmploymentController {
    constructor(private readonly employmentService: EmploymentService) {}
  
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
      @Body() body: any,
      @Headers('x-country-code') countryCode: string = 'US',
    ) {
      return this.employmentService.createEmployment(body, countryCode.toUpperCase());
    }
  }
  