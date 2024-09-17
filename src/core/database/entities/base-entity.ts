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

  @Column({ name: 'del_flag', type: 'smallint', nullable: false, default: 0 })
  delFlag: number;
}
