import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomType1727146993578 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
		CREATE TABLE room_type (
			"id" serial NOT NULL,
			"code" varchar(100) NOT NULL,
			"name" varchar(255) NOT NULL,
			"description" text NULL,
			"is_active" bool DEFAULT true NOT NULL,
			created_at timestamp with time zone NOT NULL DEFAULT now(),
			updated_at timestamp with time zone NOT NULL DEFAULT now(),
			created_by int4 NULL,
			updated_by int4 NULL,
			is_deleted bool DEFAULT false,
			deleted_at timestamp with time zone DEFAULT null,
			CONSTRAINT room_type_pkey PRIMARY KEY ("id")
		)
	`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."room_type"');
  }
}
