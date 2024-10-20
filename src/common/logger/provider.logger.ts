import { Injectable, Logger } from '@nestjs/common';
import { FlightSearchDto } from 'src/modules/flight-available/dto';
import { ALLOW_SAVE_PROVIDER_LOG, ProductType } from 'src/shared/constants';
// import { Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_EMITTERS } from 'src/shared/constants/event-emitter.constant';
import { IProviderLog } from 'src/shared';

@Injectable()
export class ProviderLogger {
  constructor(private eventEmitter: EventEmitter2) {}
  log(info: IProviderLog) {
    const message =
      '\n' +
      `------ Product: ${info.product}\n` +
      `------ Body: ${JSON.stringify(info.body)}\n` +
      `------ Request: ${typeof info.request === 'object' ? JSON.stringify(info.request) : info.request}\n` +
      `------ Response: ${typeof info.response === 'object' ? JSON.stringify(info.response) : info.response}\n` +
      `------ UserId: ${info.userId}` +
      `------ StatusCode: ${info.statusCode}`;
    Logger.log(message);
    if (ALLOW_SAVE_PROVIDER_LOG) {
      this.eventEmitter.emit(EVENT_EMITTERS.SAVE_PROVIDER_LOGS, info);
    }
  }
}
