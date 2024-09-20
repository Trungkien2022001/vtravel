import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHotelSprokenLanguage1726761958972
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."hotel_spoken_language" (
            id serial NOT NULL,
            spoken_language_id varchar(20) not null,
            name varchar(255) default null,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT hotel_spoken_language_pkey PRIMARY KEY (id),
            CONSTRAINT hotel_spoken_language_spoken_language_id_uniq UNIQUE (spoken_language_id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."hotel_spoken_language"');
  }
}
