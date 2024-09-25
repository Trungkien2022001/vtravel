import { Module } from '@nestjs/common';
import { HotelDetailController } from './detail.controller';
import { HotelDetailService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  AgentResourceEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { RedisModule } from 'src/core';
import { AuthModule } from '../agent-auth/auth.module';
import { UserModule } from '../user/agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentEntity,
      UserEntity,
      UserRoleEntity,
      RoleEntity,
      AgentResourceEntity,
    ]),
    RedisModule,
    AuthModule,
    UserModule,
  ],
  controllers: [HotelDetailController],
  providers: [HotelDetailService],
  exports: [HotelDetailService],
})
export class HotelDetailModule {}
