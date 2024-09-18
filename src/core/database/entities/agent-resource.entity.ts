import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { AgentEntity } from './agent.entity';

@Entity({ name: 'agent_resource' })
export class AgentResourceEntity extends BaseEntity {
  @Column({
    name: 'agent_id',
    nullable: false,
    type: 'int4',
  })
  agentId: number;

  @Column({
    name: 'resource_id',
    nullable: false,
    type: 'int4',
  })
  resourceId: number;
  /*
	|--------------------------------------------------------------------------
	| @ManyToOne
	|--------------------------------------------------------------------------
	*/
  @ManyToOne(() => AgentEntity, (resource) => resource.agentResources)
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'id' }])
  resource: AgentEntity;

  @ManyToOne(() => AgentEntity, (agent) => agent.agentResources)
  @JoinColumn([{ name: 'agent_id', referencedColumnName: 'id' }])
  agent: AgentEntity;
}
