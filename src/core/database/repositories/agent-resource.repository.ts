import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AgentResourceEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AgentResourceRepository extends Repository<AgentResourceEntity> {
  constructor(
    @InjectRepository(AgentResourceEntity)
    readonly repository: Repository<AgentResourceEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
