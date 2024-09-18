/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { AuthAdminController } from './auth-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/database/entities';
import { ApiConfigService } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthAdminController],
  providers: [AuthAdminService, ApiConfigService],
  exports: [],
})
export class AuthAdminModule {}
