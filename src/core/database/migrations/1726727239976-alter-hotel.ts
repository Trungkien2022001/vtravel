import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterHotel1726727239976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE INDEX hotel_hotel_id_idx ON public."hotel" (hotel_id);
        `);
    await queryRunner.query(`
            CREATE INDEX hotel_region_id_idx ON public."hotel" (region_id);
        `);
    await queryRunner.query(`
            CREATE INDEX hotel_airport_code_idx ON public."hotel" (airport_code);
        `);
    await queryRunner.query(`
            CREATE INDEX hotel_city_code_idx ON public."hotel" (city_code);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX IF EXISTS hotel_city_code_idx;
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS hotel_airport_code_idx;
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS hotel_region_id_idx;
        `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS hotel_hotel_id_idx;
        `);
  }
}
