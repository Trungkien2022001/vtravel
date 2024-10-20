import { ProviderLogsRepository } from './../database/repositories/provider-logs.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { OnEvent } from '@nestjs/event-emitter';
import { IProviderLog } from 'src/shared';
import { ProviderLogsEntity } from '../database/entities';
import { EVENT_EMITTERS } from 'src/shared/constants/event-emitter.constant';

dotenv.config();

@Injectable()
export class EventEmitterHandlerService {
  constructor(
    @InjectRepository(ProviderLogsEntity)
    public providerLogsRepository: ProviderLogsRepository,
  ) {}

  @OnEvent(EVENT_EMITTERS.SAVE_PROVIDER_LOGS)
  async handleSaveLogEvent(info: IProviderLog) {
    // TODO maybe use Kafka
    await this.providerLogsRepository.insert(info);
  }
}
