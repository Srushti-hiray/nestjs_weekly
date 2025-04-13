
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/role/:role')
  getUserByIdAndRole(
    @Param('id') id: string,
    @Param('role') role: string,
  ) {
    return this.usersService.getUserByRole(id, role);
  }
}
