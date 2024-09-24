import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomControl1727148228372 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE room_control (
          "id" serial NOT NULL,
          "hotel_id" int8 NOT NULL,
          "room_id" int8 NOT NULL,
          "max_adult" int4 default 0,
          "max_children" int4 default 0,
          "max_infant" int4 default 0,
          "availability" text NULL,
          "is_active" bool DEFAULT true NOT NULL,
          created_at timestamp with time zone NOT NULL DEFAULT now(),
          updated_at timestamp with time zone NOT NULL DEFAULT now(),
          created_by int4 NULL,
          updated_by int4 NULL,
          is_deleted bool DEFAULT false,
          deleted_at timestamp with time zone DEFAULT null,
          CONSTRAINT room_control_pkey PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      create index room_control_hotel_id_idx on room_control(hotel_id)
    `);
    await queryRunner.query(`
      create index room_control_room_id_idx on room_control(room_id)
    `);
    await queryRunner.query(`
      create index room_control_max_adult_max_children_max_infant_idx on room_control(max_adult,max_children,max_infant)
    `);
    await queryRunner.query(`
      create index room_control_availability_idx on room_control(availability)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."room_control"');
  }
}
