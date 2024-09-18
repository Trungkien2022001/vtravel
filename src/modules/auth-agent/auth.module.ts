/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/database/entities';
import { ApiConfigService } from 'src/core/config/api-config.service';
import { JwtService } from './jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, ApiConfigService, JwtService],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
