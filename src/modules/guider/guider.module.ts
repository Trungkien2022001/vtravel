import { Module } from '@nestjs/common';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { GuilderController } from './guider.controller';
import { GuilderService } from './services';
import { HotelAvailableModule } from '../hotel-available/available.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  AgentResourceEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { UserService } from '../user/agent.service';

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
    ElasticsearchModule,
    HotelAvailableModule,
  ],
  controllers: [GuilderController],
  providers: [GuilderService, UserService],
  exports: [GuilderService],
})
export class GuilderModule {}
