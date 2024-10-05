import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('error_logs_pkey', ['id'], { unique: true })
@Entity('error_logs', { schema: 'public' })
export class ErrorLogs {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'path',
    length: 50,
    default: () => '',
  })
  path: string;

  @Column('character varying', {
    name: 'matched_route',
    length: 50,
    default: () => '',
  })
  matchedRoute: string;

  @Column('character varying', {
    name: 'client_ip',
    length: 50,
    default: () => '0.0.0.0',
  })
  clientIp: string;

  @Column('character varying', {
    name: 'user',
    length: 1000,
    default: () => 'Anonymos',
  })
  user: string;

  @Column('character varying', {
    name: 'method',
    length: 10,
    default: () => '',
  })
  method: string;

  @Column('integer', {
    name: 'status',
    default: () => '200',
  })
  status: number;

  @Column('text', {
    name: 'request',
    nullable: true,
  })
  request: string | null;

  @Column('text', {
    name: 'header',
    nullable: true,
  })
  header: string | null;

  @Column('text', {
    name: 'response',
    nullable: true,
  })
  response: string | null;

  @Column('text', {
    name: 'error',
    nullable: true,
  })
  error: string | null;

  @Column('character varying', {
    name: 'error_code',
    length: 10,
    default: () => '',
  })
  errorCode: string;

  @Column('timestamp without time zone', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
