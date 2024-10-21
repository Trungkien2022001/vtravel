import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('hotel_rate_crawler_pkey', ['id'], { unique: true })
@Entity('hotel_rate_crawler', { schema: 'public' })
export class HotelRateCrawlerEntity {
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

  @Column('integer', {
    name: 'num_of_rate',
  })
  numOfRate: number;

  @Column('integer', {
    name: 'remain',
  })
  remain: number;

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

  @Column('integer', {
    name: 'created_by',
    nullable: true,
  })
  createdBy: number | null;
}
