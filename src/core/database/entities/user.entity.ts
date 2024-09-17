import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { UserRoleEntity } from './user-role.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  passwordHash: string;

  /*
	|--------------------------------------------------------------------------
	| @OneToMany
	|--------------------------------------------------------------------------
	*/
  @OneToMany(() => UserRoleEntity, (userRoles) => userRoles.role)
  userRoles: UserRoleEntity[];
}
