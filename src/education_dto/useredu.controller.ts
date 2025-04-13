import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { UsereduService } from './useredu.service';
import { CreateUserDto, validateCreateUserDto } from './dto/create-user.dto';

@Controller('useredu')
export class UsereduController {
  constructor(private readonly userService: UsereduService) {}

  @Post()
  async create(@Body() userData: any) {
    const validationResult = await validateCreateUserDto(userData);
    if (validationResult) {
      throw new BadRequestException(validationResult);
    }
    return this.userService.createUser(userData as CreateUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}