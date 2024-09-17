// role.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { UserRoleEntity } from './user-role.entity';

@Entity({ name: 'role' })
export class RoleEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  description: string;

  /*
	|--------------------------------------------------------------------------
	| @OneToMany
	|--------------------------------------------------------------------------
	*/
  @OneToMany(() => UserRoleEntity, (userRoles) => userRoles.role)
  userRoles: UserRoleEntity[];
}
