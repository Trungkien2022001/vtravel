import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResource1726658082400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."resource" (
                id serial NOT NULL,
                name varchar(100) NOT NULL,
                description varchar(255) DEFAULT NULL,
                product varchar(100) default 'hotel',
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                created_by int4 NULL,
                updated_by int4 NULL,
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT resource_pkey PRIMARY KEY (id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."resource"');
  }
}
