import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBedGroup1726762529433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."room_bed_group" (
            id serial NOT NULL,
            bed_group_id varchar(20) not null,
            description varchar(255) default null,
            configuration jsonb default null,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT room_bed_group_pkey PRIMARY KEY (id),
            CONSTRAINT room_bed_group_bed_group_id_uniq UNIQUE (bed_group_id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."room_bed_group"');
  }
}
