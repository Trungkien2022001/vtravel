import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTable1726586102037 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."role" (
            id serial NOT NULL,
            name varchar(100) NOT NULL,
            description varchar(255) DEFAULT NULL,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT role_pkey PRIMARY KEY (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE public."role" DROP CONSTRAINT role_pkey',
    );
    await queryRunner.query('DROP TABLE public."role"');
  }
}
