import { 
    Controller, 
    Post, 
    Body, 
    Headers, 
    UsePipes, 
    ValidationPipe 
  } from '@nestjs/common';
  import { EmploymentService } from './employment.service';
import { CreateEmploymentDto } from './dto/create-employement.dto';
import { CountryCode } from './decorators/country-code.decorator';
  
  @Controller('employment')
  export class EmploymentController {
    constructor(private readonly employmentService: EmploymentService) {}
  
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(
      @Body() body: CreateEmploymentDto,
      @CountryCode() countryCode: string

    ) {
      return this.employmentService.createEmployment(body, countryCode.toUpperCase());
    }
  }
  