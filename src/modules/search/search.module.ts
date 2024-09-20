import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './seach.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity, HotelEntity } from 'src/core/database/entities';
import { RedisModule } from 'src/core';
import { AuthModule } from '../auth-agent/auth.module';
import { UserModule } from '../user/agent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentEntity, HotelEntity]),
    RedisModule,
    AuthModule,
    UserModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [],
})
export class SearchModule {}
