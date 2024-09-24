import { MigrationInterface, QueryRunner } from 'typeorm';

export class HotelMapping1727015792115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE hotel_mapping (
        id serial NOT NULL,
        hotel_id int8 NOT NULL,
        region_id varchar(50) NOT NULL,
        region_type varchar(50) NOT NULL,
        country_code varchar(2) NOT NULL,
        is_active boolean default true,
        PRIMARY KEY (id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."hotel_mapping"');
  }
}
