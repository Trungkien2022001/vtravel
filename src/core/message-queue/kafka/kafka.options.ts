import { KafkaOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID,
  KAFKA_GROUP_ID,
} from 'src/shared/constants';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: KAFKA_CLIENT_ID,
      brokers: KAFKA_BROKERS,
    },
    consumer: {
      groupId: KAFKA_GROUP_ID,
    },
    producer: {
      createPartitioner: Partitioners.LegacyPartitioner,
    },
  },
};
