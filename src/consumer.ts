import { initializeTransactionalContext } from 'typeorm-transactional';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConsumerModule } from './consumer/consumer.module';

async function bootstrap() {
  initializeTransactionalContext();
  const app =
    await NestFactory.createMicroservice<MicroserviceOptions>(ConsumerModule);

  app.listen();
}

bootstrap().catch(console.error);
