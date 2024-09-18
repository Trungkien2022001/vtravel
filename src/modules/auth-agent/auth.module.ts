/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity } from 'src/core/database/entities';
import { ApiConfigService, RedisService } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([AgentEntity])],
  controllers: [AuthController],
  providers: [AuthService, ApiConfigService, RedisService],
  exports: [AuthService],
})
export class AuthModule {}
