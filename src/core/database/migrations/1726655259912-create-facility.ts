import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFacility1726655259912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."facility" (
          id serial NOT NULL,
          "name" varchar(255) NOT NULL,
          "description" varchar(4000) NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          created_by int4 NULL,
          updated_by int4 NULL,
          is_deleted bool DEFAULT false,
          deleted_at timestamp with time zone DEFAULT null,
          CONSTRAINT facility_pkey PRIMARY KEY (id)
      );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."facility"');
  }
}
