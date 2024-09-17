import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'username', type: 'varchar', length: 100, nullable: true })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 15, nullable: true })
  phone: string;

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

  @Column({ name: 'avatar', type: 'varchar', length: 1000, nullable: false })
  avatar: string;

  @Column({ name: 'birthday', type: 'datetime', nullable: true })
  birthday: Date;

  @Column({ name: 'amount', type: 'bigint', nullable: false, default: 0 })
  amount: bigint;

  @Column({ name: 'address', type: 'varchar', length: 1000, nullable: true })
  address: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  refreshToken: string;

  @Column({ name: 'prestige', type: 'tinyint', nullable: false, default: 0 })
  prestige: number;

  @Column({ name: 'is_verified', type: 'tinyint', nullable: false, default: 0 })
  isVerified: number;

  @Column({ name: 'is_blocked', type: 'tinyint', nullable: false, default: 0 })
  isBlocked: number;

  @Column({ name: 'rating', type: 'float', nullable: false, default: 0 })
  rating: number;

  @Column({
    name: 'sell_failed_count_by_seller',
    type: 'int',
    nullable: false,
    default: 0,
  })
  sellFailedCountBySeller: number;

  @Column({
    name: 'sell_failed_count_by_auctioneer',
    type: 'int',
    nullable: false,
    default: 0,
  })
  sellFailedCountByAuctioneer: number;

  @Column({
    name: 'sell_success_count',
    type: 'int',
    nullable: false,
    default: 0,
  })
  sellSuccessCount: number;

  @Column({
    name: 'buy_cancel_count_by_seller',
    type: 'int',
    nullable: false,
    default: 0,
  })
  buyCancelCountBySeller: number;

  @Column({
    name: 'buy_cancel_count_by_auctioneer',
    type: 'int',
    nullable: false,
    default: 0,
  })
  buyCancelCountByAuctioneer: number;

  @Column({
    name: 'buy_success_count',
    type: 'int',
    nullable: false,
    default: 0,
  })
  buySuccessCount: number;

  @Column({ name: 'custom_config', type: 'json', nullable: true })
  customConfig: any;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'del_flag', type: 'tinyint', nullable: false, default: 0 })
  delFlag: number;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
