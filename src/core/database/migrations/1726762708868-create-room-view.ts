import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomView1726762708868 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."room_view" (
            id serial NOT NULL,
            view_id varchar(20) not null,
            name varchar(255) default null,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT room_view_pkey PRIMARY KEY (id),
            CONSTRAINT room_view_view_id_uniq UNIQUE (view_id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."room_view"');
  }
}
