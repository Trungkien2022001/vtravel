import { Module, Provider } from '@nestjs/common';
import { EventEmitterHandlerService } from './event-emitter.service';
import { ConfigService } from '@nestjs/config';
import { ProviderLogsEntity } from '../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
const providers: Provider[] = [EventEmitterHandlerService, ConfigService];
@Module({
  providers,
  imports: [TypeOrmModule.forFeature([ProviderLogsEntity])],
  exports: [...providers],
})
export class EventEmitterHandlerModule {}
