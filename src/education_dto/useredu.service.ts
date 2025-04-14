import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsereduService {
  private users: any[] = [];

  async createUser(userData: CreateUserDto) {

    const newUser = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async findAll() {
    return this.users;
  }
}