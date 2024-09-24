import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAirport1726654934021 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(` 
      CREATE TABLE public.airport (
        id serial4 NOT NULL,
        airport_code varchar(3) NULL,
        airport_name varchar(255) NULL,
        latitude float8 NULL,
        longitude float8 NULL,
        region_type varchar(255) NULL,
        country_code varchar(2) NULL,
        region_id varchar(255) DEFAULT ''::character varying NULL,
        region_name_full varchar(255) NULL,
        CONSTRAINT airport_pkey PRIMARY KEY (id)
      );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."airport"');
  }
}
