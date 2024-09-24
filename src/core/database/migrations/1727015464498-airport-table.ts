import { MigrationInterface, QueryRunner } from 'typeorm';

export class AirportTable1727015464498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE airport (
        airport_id VARCHAR(255) NOT NULL,
        airport_code VARCHAR(3),
        airport_name VARCHAR(255),
        latitude DOUBLE PRECISION,  -- Dùng double precision thay vì numeric
        longitude DOUBLE PRECISION, -- Dùng double precision thay vì numeric
        main_region_id VARCHAR(255),
        country_code VARCHAR(2),
        region_id VARCHAR(255) NOT NULL DEFAULT '',
        region_name_full VARCHAR(255),
        PRIMARY KEY (airport_id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."airport"');
  }
}
