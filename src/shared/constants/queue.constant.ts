export const PRODUCER_TYPE = {
  AWS_SQS: 'AWS_SQS',
  KAFKA: 'KAFKA',
} as const;
type TProducer = (typeof PRODUCER_TYPE)[keyof typeof PRODUCER_TYPE];
export const DEFFAULT_PRODUCER: TProducer = PRODUCER_TYPE.KAFKA;
