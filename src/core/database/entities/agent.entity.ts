import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';
import { AgentResourceEntity } from './agent-resource.entity';

@Entity({ name: 'agent' })
export class AgentEntity extends BaseEntity {
  @Column({ name: 'username', type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  /*
	|--------------------------------------------------------------------------
	| @OneToMany
	|--------------------------------------------------------------------------
	*/
  @OneToMany(
    () => AgentResourceEntity,
    (agentResources) => agentResources.agent,
  )
  agentResources: AgentResourceEntity[];
}
