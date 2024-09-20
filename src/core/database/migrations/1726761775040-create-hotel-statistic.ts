import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHotelStatistic1726761775040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."hotel_statistic" (
            id serial NOT NULL,
            statistic_id varchar(20) not null,
            name varchar(255) default null,
            value varchar(50) default null,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT hotel_statistic_pkey PRIMARY KEY (id),
            CONSTRAINT hotel_statistic_statistic_id_uniq UNIQUE (statistic_id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."hotel_statistic"');
  }
}
