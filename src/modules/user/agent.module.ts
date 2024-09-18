import { Module } from '@nestjs/common';
import { UserService } from './agent.service';
import { UserController } from './agent.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
