import { Module } from '@nestjs/common';
import { VehicleDetailController } from './detail.controller';
import { VehicleDetailService } from './service';
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
  controllers: [VehicleDetailController],
  providers: [VehicleDetailService],
  exports: [VehicleDetailService],
})
export class VehicleDetailModule {}
