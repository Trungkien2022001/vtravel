import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHotelAttribute1726761382007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE public."hotel_attribute" (
            id serial NOT NULL,
            attribute_id varchar(20) not null,
            name varchar(255) default null,
            type varchar(255) default null,
            value varchar(255) default null,
            created_at timestamp with time zone NOT NULL DEFAULT now(),
            updated_at timestamp with time zone NOT NULL DEFAULT now(),
            created_by int4 NULL,
            updated_by int4 NULL,
            is_deleted bool DEFAULT false,
            deleted_at timestamp with time zone DEFAULT null,
            CONSTRAINT hotel_attribute_pkey PRIMARY KEY (id),
            CONSTRAINT hotel_attribute_attribute_id_uniq UNIQUE (attribute_id)
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."hotel_attribute"');
  }
}
