import { Module } from '@nestjs/common';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './services';
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
  controllers: [InsuranceController],
  providers: [InsuranceService, UserService],
  exports: [InsuranceService],
})
export class InsuranceModule {}
