import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsereduService } from './useredu.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserValidationPipe } from './pipes/user-validation.pipe';

@Controller('useredu')
export class UsereduController {
  constructor(private readonly userService: UsereduService) {}

  @Post()
  async create(@Body(new UserValidationPipe()) userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
