// resource.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity';

import { DEFAULT_PRODUCT } from 'src/shared/constants';
import { AgentResourceEntity } from './agent-resource.entity';

@Entity({ name: 'resource' })
export class ResourceEntity extends BaseEntity {
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

  @Column({
    name: 'description',
    type: 'varchar',
    length: 250,
    nullable: false,
    default: DEFAULT_PRODUCT,
  })
  resource: string;

  /*
	|--------------------------------------------------------------------------
	| @OneToMany
	|--------------------------------------------------------------------------
	*/
  @OneToMany(
    () => AgentResourceEntity,
    (agentResources) => agentResources.resource,
  )
  agentResources: AgentResourceEntity[];
}
