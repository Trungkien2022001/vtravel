import { MigrationInterface, QueryRunner } from 'typeorm';

export class Regions1727016005894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE region (
        id serial NOT NULL,
        region_id varchar(50) NOT NULL,
        region_name varchar(255) NOT NULL,
        region_name_full varchar(1000) NOT NULL,
        region_type varchar(50) NOT NULL,
        country_id varchar(2) NOT NULL,
        country_code varchar(2) NOT NULL,
        country_name varchar(100) not null,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        ancestors text,
        descendants text,
        PRIMARY KEY (id),
        CONSTRAINT region_region_id_uniq UNIQUE (region_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."region"');
  }
}
