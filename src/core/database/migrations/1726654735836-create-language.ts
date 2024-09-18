import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLanguage1726654735836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."language" (
            id serial NOT NULL,
            "name" varchar(50) NOT NULL,
            "culture_code" varchar(10) NOT NULL,
            "url_prefix" varchar(15) NULL,
            "active" bool NOT NULL,
            "sort_order" int4 NOT NULL,
            "theme" varchar(50) NULL,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT language_pkey PRIMARY KEY (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."language"');
  }
}
