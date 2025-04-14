
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class IsEvenPipe implements PipeTransform {
  transform(value: string): number {
    const number = parseInt(value, 10);

    if (isNaN(number)) {
      throw new BadRequestException('Validation failed: Not a number');
    }

    if (number % 2 !== 0) {
      throw new BadRequestException('Validation failed: Number is not even');
    }

    return number;
  }
}
