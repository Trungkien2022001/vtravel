import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHotelTheme1726761880145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."hotel_theme" (
                id serial NOT NULL,
                theme_id varchar(20) not null,
                name varchar(255) default null,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                created_by int4 NULL,
                updated_by int4 NULL,
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT hotel_theme_pkey PRIMARY KEY (id),
                CONSTRAINT hotel_theme_theme_id_uniq UNIQUE (theme_id)
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."hotel_theme"');
  }
}
