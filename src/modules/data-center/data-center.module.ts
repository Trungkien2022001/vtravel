import { Module } from '@nestjs/common';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { DataCenterController } from './data-center.controller';
import { DataCenterService } from './services';
import { SearchModule } from '../hotel-search/search.module';
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
    SearchModule,
  ],
  controllers: [DataCenterController],
  providers: [DataCenterService, UserService],
  exports: [DataCenterService],
})
export class DataCenterModule {}
