import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCurrency1726655190280 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."currency" (
          id serial NOT NULL,
          "currency_code" varchar(10) NOT NULL,
          "currency_symbol" varchar(10) NULL,
          "currency_description" varchar(4000) NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          created_by int4 NULL,
          updated_by int4 NULL,
          is_deleted bool DEFAULT false,
          deleted_at timestamp with time zone DEFAULT null,
          CONSTRAINT currency_pkey PRIMARY KEY (id)
      );
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."currency"');
  }
}
