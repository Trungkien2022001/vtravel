import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HotelRepository extends Repository<HotelEntity> {
  constructor(
    @InjectRepository(HotelEntity) readonly repository: Repository<HotelEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
