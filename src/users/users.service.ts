import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: '1', name: 'John Doe', role: 'user' },
    { id: '2', name: 'Jane Smith', role: 'admin' },
    { id: '3', name: 'Alice Johnson', role: 'user' },
    { id: '4', name: 'Bob Brown', role: 'admin' },
    { id: '5', name: 'Charlie Black', role: 'user' },
  ];

  getUserByRole(id: string, role: string) {
    const user = this.users.find((user) => user.id === id && user.role === role);

    if (user) {
      if (role === 'admin') {
        
        return {
          id: user.id,
          name: user.name,
          permissions: ['read', 'write', 'delete'],
          role: user.role,
        };
      } else if (role === 'user') {
       
        return {
          id: user.id,
          name: user.name,
          role: user.role,
        };
      }
    }

    return { message: 'User not found or role mismatch' };
  }
}
