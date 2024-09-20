import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomInfo1726762766825 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."room_info" (
                id serial NOT NULL,
                room_id varchar(20) not null,
                room_type_id varchar(50) not null,
                hotel_id int8 NOT NULL,
                overview text default null,
                amenities jsonb default null,
                bed_groups jsonb default null,
                views jsonb default null,
                max_person int4,
                max_adult int4,
                max_children int4,
                max_infant int4,
                extra_fees jsonb default null,
                facilities JSONB,
                non_smoking boolean default null,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                created_by int4 NULL,
                updated_by int4 NULL,
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT room_info_pkey PRIMARY KEY (id),
                CONSTRAINT room_info_room_id_uniq UNIQUE (room_id)
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."room_info"');
  }
}
