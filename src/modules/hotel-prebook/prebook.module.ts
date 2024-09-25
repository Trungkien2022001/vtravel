import { Module } from '@nestjs/common';
import { HotelPrebookController } from './prebook.controller';
import { HotelPrebookService } from './service';
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
  controllers: [HotelPrebookController],
  providers: [HotelPrebookService],
  exports: [HotelPrebookService],
})
export class HotelPrebookModule {}
