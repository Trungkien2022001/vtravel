import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { BaseEntity } from './base-entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 100, nullable: true })
  username: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  passwordHash: string;

  @Column({
    name: 'role_id',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'user',
  })
  roleId: string;

  @Column({ name: 'del_flag', type: 'tinyint', nullable: false, default: 0 })
  delFlag: number;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
