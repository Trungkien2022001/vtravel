import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1726584320383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."user" (
            id serial NOT NULL,
            username varchar(100) NOT NULL,
            password_hash varchar(255) NOT NULL,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT user_pkey PRIMARY KEY (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   'ALTER TABLE public."user" DROP CONSTRAINT user_pkey',
    // );
    await queryRunner.query('DROP TABLE public."user"');
  }
}
