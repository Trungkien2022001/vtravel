import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomAmenity1726762337247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."room_amenity" (
            id serial NOT NULL,
            amenity_id varchar(20) not null,
            name varchar(255) default null,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT room_amenity_pkey PRIMARY KEY (id),
            CONSTRAINT room_amenity_amenity_id_uniq UNIQUE (amenity_id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."room_amenity"');
  }
}
