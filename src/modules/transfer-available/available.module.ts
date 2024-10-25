import { Module } from '@nestjs/common';
import { AvailableController } from './available.controller';
import { AvailableService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity, HotelEntity } from 'src/core/database/entities';
import { HotelMappingModule, RedisModule, RegionMappingModule } from 'src/core';
import { AuthModule } from '../agent-auth/auth.module';
import { UserModule } from '../user/agent.module';
import { ProcessorsModules } from './processors';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentEntity, HotelEntity]),
    RedisModule,
    AuthModule,
    UserModule,
    RegionMappingModule,
    HotelMappingModule,
    ...Object.values(ProcessorsModules),
  ],
  controllers: [AvailableController],
  providers: [AvailableService],
  exports: [AvailableService],
})
export class TransferSearchModule {}
