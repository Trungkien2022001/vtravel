import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DestinationRegionMappingEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DestinationRegionMappingRepository extends Repository<DestinationRegionMappingEntity> {
  constructor(
    @InjectRepository(DestinationRegionMappingEntity)
    readonly repository: Repository<DestinationRegionMappingEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
