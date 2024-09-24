import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomRate1727149593208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE room_rate (
              "id" serial NOT NULL,
              "hotel_id" int8 NOT NULL,
              "room_id" int8 NOT NULL,
              "rate_id" int4 default 1,
              full_rate DOUBLE PRECISION,
              currency varchar(20) default 'USD',
              refundable boolean default true,
              is_has_extra_bed boolean default false,
              extra_bed double precision default 0,
              extra_children double precision default 0,
              extra_infant double precision default 0,
              cancellation_policies jsonb,
              "is_active" bool DEFAULT true NOT NULL,
              created_at timestamp with time zone NOT NULL DEFAULT now(),
              updated_at timestamp with time zone NOT NULL DEFAULT now(),
              created_by int4 NULL,
              updated_by int4 NULL,
              is_deleted bool DEFAULT false,
              deleted_at timestamp with time zone DEFAULT null,
              CONSTRAINT room_rate_pkey PRIMARY KEY ("id")
          )
        `);
    await queryRunner.query(`
          create index room_rate_hotel_id_idx on room_rate(hotel_id)
        `);
    await queryRunner.query(`
          create index room_rate_room_id_idx on room_rate(room_id)
        `);
    await queryRunner.query(`
          create index room_rate_rate_id_idx on room_rate(rate_id)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."room_rate"');
  }
}
