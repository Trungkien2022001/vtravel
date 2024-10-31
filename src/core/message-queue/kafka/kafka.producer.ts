// app.service.ts
import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KAFKA_BROKERS, KAFKA_CLIENT_ID } from 'src/shared/constants';

@Injectable()
export class KafkaProducer {
  private readonly kafkaInstance: Kafka;
  private producer: Producer;
  constructor() {
    this.kafkaInstance = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: KAFKA_BROKERS,
      connectionTimeout: 3000,
      authenticationTimeout: 1000,
      reauthenticationThreshold: 10000,
    });

    this.producer = this.kafkaInstance.producer();
  }

  async sendMessage(message: any, topic: string) {
    await this.producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  onModuleInit() {
    this.producer.connect();
  }
}
