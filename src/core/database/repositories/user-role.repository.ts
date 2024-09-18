import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRoleEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRoleRepository extends Repository<UserRoleEntity> {
  constructor(
    @InjectRepository(UserRoleEntity)
    readonly repository: Repository<UserRoleEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
