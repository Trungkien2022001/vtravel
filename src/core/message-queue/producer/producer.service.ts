import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  DEFFAULT_PRODUCER,
  KAFKA_TOPIC,
  PRODUCER_TYPE,
  PRODUCTS,
} from 'src/shared/constants';
import { KafkaProducer } from '../kafka';

@Injectable()
export class ProducerService {
  private producer: any;
  constructor(private readonly moduleRef: ModuleRef) {
    this.getProcessorFactory(DEFFAULT_PRODUCER);
  }

  async getProcessorFactory(providerName: string): Promise<void> {
    switch (providerName) {
      case PRODUCER_TYPE.KAFKA:
        this.producer = await this.moduleRef.get(KafkaProducer, {
          strict: false,
        });
        break;

      case PRODUCER_TYPE.AWS_SQS:
      default:
        throw new Error(
          `Producer service not found for producer: ${providerName}`,
        );
    }
  }

  async sendMessage(message: any, topic: string) {
    try {
      await this.producer.sendMessage({
        topic,
        message,
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  async sendFlightMessage(message) {
    const topic = KAFKA_TOPIC.FLIGHT;
    await this.sendMessage(
      {
        ...message,
        product: PRODUCTS.FLIGHT,
      },
      topic,
    );
  }

  async sendTestMessage(message) {
    const topic = KAFKA_TOPIC.FLIGHT;
    await this.sendMessage(
      {
        ...message,
        product: PRODUCTS.TRIP,
      },
      topic,
    );
  }
}
