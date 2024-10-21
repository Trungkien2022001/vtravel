import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HotelRateCrawlerEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HotelRateCrawlerRepository extends Repository<HotelRateCrawlerEntity> {
  constructor(
    @InjectRepository(HotelRateCrawlerEntity)
    readonly repository: Repository<HotelRateCrawlerEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
