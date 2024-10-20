import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProviderLogsEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProviderLogsRepository extends Repository<ProviderLogsEntity> {
  constructor(
    @InjectRepository(ProviderLogsEntity)
    readonly repository: Repository<ProviderLogsEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
