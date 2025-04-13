import { Module } from '@nestjs/common';
import { UsereduController } from './useredu.controller';
import { UsereduService } from './useredu.service';

@Module({
  controllers: [UsereduController],
  providers: [UsereduService],
})
export class UsereduModule {}