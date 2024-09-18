import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAirport1726654934021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."airport" (
          id serial NOT NULL,
          "code" varchar(20) NULL,
          "name" varchar(255) NOT NULL,
          "city_code" varchar(20) NULL,
          "city_name" varchar(255) NULL,
          "country_code" varchar(20) NULL,
          "currency_code" varchar(20) NULL,
          "country_name" varchar(255) NULL,
          "is_grouped_airport" bool NOT NULL,
          "latitude" varchar(50) NULL,
          "longitude" varchar(50) NULL,
          "time_zone_utc_offset" float4 NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          created_by int4 NULL,
          updated_by int4 NULL,
          is_deleted bool DEFAULT false,
          deleted_at timestamp with time zone DEFAULT null,
          CONSTRAINT airport_pkey PRIMARY KEY (id)
      );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."airport"');
  }
}
