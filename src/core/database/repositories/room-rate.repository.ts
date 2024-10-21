import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoomRateEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoomRateRepository extends Repository<RoomRateEntity> {
  constructor(
    @InjectRepository(RoomRateEntity)
    readonly repository: Repository<RoomRateEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
