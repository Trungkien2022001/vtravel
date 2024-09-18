import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UserAdminController } from './user-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity, RoleEntity])],
  controllers: [UserAdminController],
  providers: [UserAdminService],
})
export class UserAdminModule {}
