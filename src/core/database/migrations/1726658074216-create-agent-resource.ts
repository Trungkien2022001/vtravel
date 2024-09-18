import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAgentResource1726658074216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."agent_resource" (
                id serial NOT NULL,
                agent_id int4 NOT NULL,
                resource_id int4 NOT NULL,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                created_by int4 NULL,
                updated_by int4 NULL,
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT agent_resource_pkey PRIMARY KEY (id),
                CONSTRAINT agent_resource_agent_id_resource_id_uniq UNIQUE (agent_id, resource_id)
                -- CONSTRAINT agent_resource_agent_id_pkey  FOREIGN KEY (agent_id) REFERENCES public."agent" (id) on delete cascade,
                -- CONSTRAINT agent_resource_resource_id_pkey  FOREIGN KEY (resource_id) REFERENCES public."resource" (id) on delete cascade
            );
        `);
    await queryRunner.query(`
            CREATE INDEX agent_resource_agent_id_resource_id_idx on public."agent_resource" (agent_id, resource_id)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."agent_resource"');
  }
}
