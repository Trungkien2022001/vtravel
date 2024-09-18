import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCountry1726653977591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."country" (
          id serial NOT NULL,
          "name" varchar(255) NOT NULL,
          "code" varchar(20) NULL,
          "time_zone_utc_offset" float4 NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          created_by int4 NULL,
          updated_by int4 NULL,
          is_deleted bool DEFAULT false,
          deleted_at timestamp with time zone DEFAULT null,
          CONSTRAINT country_pkey PRIMARY KEY (id)
      );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."country"');
  }
}
