import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validateCreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserValidationPipe implements PipeTransform {
  async transform(value: any) {
    const errors = await validateCreateUserDto(value);
    if (errors) {
      throw new BadRequestException(errors);
    }
    return value;
  }
}