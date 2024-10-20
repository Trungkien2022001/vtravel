import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('provider_logs_pkey', ['id'], { unique: true })
@Entity('provider_logs', { schema: 'public' })
export class ProviderLogsEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;
  @Column('text', {
    name: 'request',
    nullable: true,
  })
  request: string | null;

  @Column('text', {
    name: 'response',
    nullable: true,
  })
  response: string | null;

  @Column('text', {
    name: 'body',
    nullable: true,
  })
  body: string | null;

  @Column('integer', {
    name: 'status_code',
  })
  statusCode: number;

  @Column('integer', {
    name: 'user_id',
    nullable: true,
  })
  userId?: number;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
