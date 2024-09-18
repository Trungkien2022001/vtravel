import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResourceEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResourceRepository extends Repository<ResourceEntity> {
  constructor(
    @InjectRepository(ResourceEntity)
    readonly repository: Repository<ResourceEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
