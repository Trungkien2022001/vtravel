import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;

  @Column({
    name: 'created_by',
    type: 'int4',
    nullable: false,
  })
  createdBy: number;

  @Column({
    name: 'updated_by',
    type: 'int4',
    nullable: false,
  })
  updatedBy: number;

  @Column({ name: 'is_deleted', type: 'smallint', nullable: false, default: 0 })
  isDeleted: number;

  @Column({
    name: 'deleted_at',
    type: 'timestamp without time zone',
    nullable: true,
  })
  deletedAt: Date;
}
