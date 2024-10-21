import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('room_rate_v2_pkey', ['id'], { unique: true })
@Entity('room_rate_v2', { schema: 'public' })
export class RoomRateEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'hotel_id',
    length: 50,
  })
  hotelId: string;

  @Column('character varying', {
    name: 'room_id',
    length: 50,
  })
  roomId: string;

  @Column('character varying', {
    name: 'rate_code',
    length: 50,
  })
  rateCode: string;

  @Column('character varying', {
    name: 'rate_name',
    length: 255,
  })
  rateName: string;

  @Column('double precision', {
    name: 'full_rate',
    nullable: true,
  })
  fullRate: number | null;

  @Column('character varying', {
    name: 'currency',
    length: 20,
    default: () => 'USD',
  })
  currency: string;

  @Column('integer', {
    name: 'remain',
  })
  remain: number;

  @Column('boolean', {
    name: 'refundable',
    default: () => 'true',
  })
  refundable: boolean;

  @Column('boolean', {
    name: 'is_has_extra_bed',
    default: () => 'false',
  })
  isHasExtraBed: boolean;

  @Column('double precision', {
    name: 'extra_bed_rate',
    default: () => '0',
  })
  extraBedRate: number;

  @Column('double precision', {
    name: 'extra_children',
    default: () => '0',
  })
  extraChildren: number;

  @Column('double precision', {
    name: 'extra_infant',
    default: () => '0',
  })
  extraInfant: number;

  @Column('jsonb', {
    name: 'cancellation_policies',
    nullable: true,
  })
  cancellationPolicies: any | null;

  @Column('boolean', {
    name: 'is_active',
    default: () => 'true',
  })
  isActive: boolean;

  @Column('timestamptz', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamptz', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column('integer', {
    name: 'created_by',
    nullable: true,
  })
  createdBy: number | null;

  @Column('integer', {
    name: 'updated_by',
    nullable: true,
  })
  updatedBy: number | null;

  @Column('boolean', {
    name: 'is_deleted',
    default: () => 'false',
  })
  isDeleted: boolean;

  @Column('timestamptz', {
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date | null;

  @Column('double precision', {
    name: 'tax',
    default: () => '0',
  })
  tax: number;

  @Column('double precision', {
    name: 'fee',
    default: () => '0',
  })
  fee: number;

  @Column('jsonb', {
    name: 'promotions',
    nullable: true,
  })
  promotions: any | null;

  @Column('jsonb', {
    name: 'price_metadata',
    nullable: true,
  })
  priceMetadata: any | null;
}
