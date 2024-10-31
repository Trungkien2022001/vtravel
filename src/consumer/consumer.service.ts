import { RunnerConsummer } from './runner/runner.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
  KAFKA_TOPIC,
} from 'src/shared/constants';

@Injectable()
export class ConsumerService implements OnModuleInit {
  constructor(private readonly runnerConsummer: RunnerConsummer) {}
  private kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS,
  });

  private consumer = this.kafka.consumer({ groupId: KAFKA_GROUP_ID });

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KAFKA_TOPIC.FLIGHT,
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        Logger.log(
          `Topic: ${topic}, Partition: ${partition}, Message: ${message.value.toString()}`,
        );
        try {
          const payload = JSON.parse(message.value.toString());
          await this.runnerConsummer.handler(payload);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });

    console.log('Consumer started and listening to topic: test-topic');
  }
}
