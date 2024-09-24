import { MigrationInterface, QueryRunner } from 'typeorm';

export class DestinationRegionMapping1727015682213
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE destination_region_mapping (
        code VARCHAR(10) NOT NULL,
        country_code VARCHAR(2),
        region_id VARCHAR(255) NOT NULL DEFAULT '',
        region_name_full VARCHAR(255),
        PRIMARY KEY (code)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."destination_region_mapping"');
  }
}
