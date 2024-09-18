import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AgentEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AgentRepository extends Repository<AgentEntity> {
  constructor(
    @InjectRepository(AgentEntity) readonly repository: Repository<AgentEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
