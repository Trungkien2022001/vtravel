/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity } from 'src/core/database/entities';
import { ApiConfigService, RedisModule } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([AgentEntity]), RedisModule],
  controllers: [AuthController],
  providers: [AuthService, ApiConfigService],
  exports: [AuthService],
})
export class AuthModule {}
