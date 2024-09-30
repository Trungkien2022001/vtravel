import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { UserAdminService } from '../user-admin/user-admin.service';
import { RedisService } from 'src/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { CurrencyService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentEntity,
      UserEntity,
      UserRoleEntity,
      RoleEntity,
    ]),
  ],
  controllers: [CurrencyController],
  providers: [UserAdminService, RedisService, CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
