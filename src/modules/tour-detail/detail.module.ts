import { Module } from '@nestjs/common';
import { TourDetailController } from './detail.controller';
import { TourDetailService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  AgentResourceEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { AuthModule } from '../agent-auth/auth.module';
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
    ElasticsearchModule,
  ],
  controllers: [TourDetailController],
  providers: [TourDetailService],
  exports: [TourDetailService],
})
export class TourDetailModule {}
