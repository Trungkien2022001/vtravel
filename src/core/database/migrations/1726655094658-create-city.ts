import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCity1726655094658 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."city" (
                id serial NOT NULL,
               	"name" varchar(255) NOT NULL,
                "city_code" varchar(20) NULL,
                "country_code" varchar(20) NULL,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                created_by int4 NULL,
                updated_by int4 NULL,
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT city_pkey PRIMARY KEY (id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."city"');
  }
}
