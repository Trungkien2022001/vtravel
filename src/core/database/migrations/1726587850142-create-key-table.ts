import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKeyTable1726587850142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."key" (
                id serial NOT NULL,
                key varchar(1000) NOT NULL,
                description varchar(255) NOT NULL,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT key_pkey PRIMARY KEY (id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."key"');
  }
}
