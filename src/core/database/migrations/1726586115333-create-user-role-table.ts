import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRoleTable1726586115333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."user_role" (
            id serial NOT NULL,
            user_id int4 NOT NULL,
            role_id int4 NOT NULL,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT user_role_pkey PRIMARY KEY (id),
            CONSTRAINT user_role_user_id_role_id_uniq UNIQUE (user_id, role_id)
        );
    `);
    await queryRunner.query(`
        CREATE INDEX user_role_user_id_role_id_idx on public."user_role" (user_id, role_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   'ALTER TABLE public."user_role" DROP CONSTRAINT user_role_pkey',
    // );
    await queryRunner.query('DROP TABLE public."user_role"');
  }
}
