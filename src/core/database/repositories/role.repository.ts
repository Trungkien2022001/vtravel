import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleRepository extends Repository<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity) readonly repository: Repository<RoleEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
