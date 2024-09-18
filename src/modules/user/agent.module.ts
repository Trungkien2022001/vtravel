import { Module } from '@nestjs/common';
import { UserService } from './agent.service';
import { UserController } from './agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  AgentResourceEntity,
  ResourceEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { UserAdminService } from '../user-admin/user-admin.service';
import { UserAdminModule } from '../user-admin/user-admin.module';
import { RedisService } from 'src/core';

@Module({
  imports: [
    UserAdminModule,
    TypeOrmModule.forFeature([
      AgentEntity,
      AgentResourceEntity,
      ResourceEntity,
      UserEntity,
      UserRoleEntity,
      RoleEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserAdminService, RedisService],
})
export class UserModule {}
