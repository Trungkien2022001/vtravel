import { Entity, Column } from 'typeorm';
import { BasePrimaryIdOnlyEntity } from './base-entity';

@Entity({ name: 'destination-region-mapping' })
export class DestinationRegionMappingEntity extends BasePrimaryIdOnlyEntity {
  @Column({
    name: 'code',
    nullable: true,
    type: 'varchar',
    length: 20,
  })
  code: string;

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
