import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from './role.entity';
import { BaseEntity } from './base-entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_role' })
export class UserRoleEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    nullable: false,
    type: 'int4',
  })
  userId: number;

  @Column({
    name: 'role_id',
    nullable: false,
    type: 'int4',
  })
  roleId: number;
  /*
	|--------------------------------------------------------------------------
	| @ManyToOne
	|--------------------------------------------------------------------------
	*/
  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: RoleEntity;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;
}
