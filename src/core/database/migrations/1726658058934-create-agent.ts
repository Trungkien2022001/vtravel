import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAgent1726658058934 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."agent" (
                id serial NOT NULL,
                username varchar(100) NOT NULL,
                password varchar(255) NOT NULL,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                created_by int4 NULL,
                updated_by int4 NULL,
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT agent_pkey PRIMARY KEY (id),
                CONSTRAINT agent_username_uniq UNIQUE (username)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."agent"');
  }
}
