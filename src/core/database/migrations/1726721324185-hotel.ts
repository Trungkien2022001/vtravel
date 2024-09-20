import { MigrationInterface, QueryRunner } from 'typeorm';

export class Hotel1726721324185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."hotel" (
          id serial NOT NULL,
          hotel_id int8 NOT NULL,
          region_id int8 NOT NULL,
          airport_code varchar(20) default null,
          city_code varchar(50) default null,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          created_by int4 NULL,
          updated_by int4 NULL,
          is_deleted bool DEFAULT false,
          deleted_at timestamp with time zone DEFAULT null,
          CONSTRAINT hotel_pkey PRIMARY KEY (id),
          CONSTRAINT hotel_hotel_id_uniq UNIQUE (hotel_id)
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."hotel"');
  }
}
