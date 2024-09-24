import { Entity, Column } from 'typeorm';
import { BasePrimaryIdOnlyEntity } from './base-entity';

@Entity({ name: 'airport' })
export class AirportEntity extends BasePrimaryIdOnlyEntity {
  @Column({
    name: 'airport_code',
    nullable: true,
    type: 'varchar',
    length: 20,
  })
  airportCode: string;

  @Column({
    name: 'airport_name',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  airportName: string;

  @Column({
    name: 'latitude',
    nullable: false,
    type: 'float8',
  })
  latitude: number;

  @Column({
    name: 'longitude',
    nullable: false,
    type: 'float8',
  })
  longitude: number;

  @Column({
    name: 'region_type',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  regionType: string;

  @Column({
    name: 'region_id',
    nullable: false,
    type: 'int8',
  })
  regionId: number;

  @Column({
    name: 'country_code',
    nullable: true,
    type: 'varchar',
    length: 12,
  })
  countryCode: string;

  @Column({
    name: 'region_name_full',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  regionNameFull: string;
}
