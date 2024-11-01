import { initializeTransactionalContext } from 'typeorm-transactional';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerModule } from './modules/consumer/consumer.module';
import { KAFKA_BROKERS, KAFKA_GROUP_ID } from './shared/constants';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConsumerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: KAFKA_BROKERS, // Địa chỉ Kafka broker
        },
        consumer: {
          groupId: KAFKA_GROUP_ID,
        },
      },
    },
  );

  app.listen();
}

bootstrap().catch(console.error);
