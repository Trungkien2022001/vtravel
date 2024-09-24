import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AirportEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AirportRepository extends Repository<AirportEntity> {
  constructor(
    @InjectRepository(AirportEntity)
    readonly repository: Repository<AirportEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
