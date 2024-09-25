import { Module } from '@nestjs/common';
import { HotelRetrieveController } from './retrieve.controller';
import { HotelRetrieveService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  AgentResourceEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { RedisModule } from 'src/core';
import { AuthModule } from '../auth-agent/auth.module';
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
  controllers: [HotelRetrieveController],
  providers: [HotelRetrieveService],
  exports: [HotelRetrieveService],
})
export class HotelRetrieveModule {}
