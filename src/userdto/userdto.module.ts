import { Module } from '@nestjs/common';
import { UserdtoController } from './userdto.controller';

@Module({
  controllers: [UserdtoController],
})
export class UserdtoModule {}
