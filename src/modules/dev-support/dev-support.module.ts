import { Module } from '@nestjs/common';
import { DevSupportController } from './dev-support.controller';
import { UserAdminService } from '../user-admin/user-admin.service';
import { RedisService } from 'src/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { DevSupportService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentEntity,
      UserEntity,
      UserRoleEntity,
      RoleEntity,
    ]),
  ],
  controllers: [DevSupportController],
  providers: [UserAdminService, RedisService, DevSupportService],
  exports: [],
})
export class DevSupportModule {}
