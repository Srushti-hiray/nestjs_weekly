
import { 
    Controller, 
    Post, 
    Body, 
    UsePipes, 
    ValidationPipe, 
    BadRequestException 
  } from '@nestjs/common';
  import { CreateUserDto } from './dto/create-user.dto';
  
  @Controller('userdto')
  export class UserdtoController {
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    createUser(@Body() createUserDto: CreateUserDto) {
      try {
        // If validation passes, this will execute
        return {
          message: 'User created successfully',
          data: createUserDto
        };
      } catch (error) {
        // This will catch any unexpected errors
        throw new BadRequestException({
          message: 'Validation failed',
          errors: [error.message]
        });
      }
    }
  }