import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity({ name: 'hotel' })
export class HotelEntity extends BaseEntity {
  @Column({
    name: 'hotel_id',
    nullable: false,
    type: 'int4',
  })
  hotelId: number;

  @Column({
    name: 'region_id',
    nullable: false,
    type: 'int4',
  })
  regionId: number;

  @Column({
    name: 'airport_code',
    nullable: true,
    type: 'varchar',
    length: 20,
  })
  airportCode: string;

  @Column({
    name: 'city_code',
    nullable: true,
    type: 'varchar',
    length: 50,
  })
  cityCode: string;
}
