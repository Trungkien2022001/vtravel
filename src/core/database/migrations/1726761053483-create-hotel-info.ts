import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHotelInfo1726761053483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public."hotel_info" (
                 id serial NOT NULL,
                hotel_id int8 NOT NULL,
                name TEXT NOT NULL,
                address TEXT NOT NULL,
                country_code VARCHAR(100) NOT NULL,
                airport_code_code vARCHAR(100),
                city_code varchar(50),
                district_code varchar(50),
                street_code varchar(50),
                postal_code VARCHAR(100),
                currency VARCHAR(10),
                rating JSONB,
                latitude FLOAT8,
                longitude FLOAT8,
                phone VARCHAR(255),
                fax VARCHAR(255),
                chain TEXT,
                brand TEXT,
                type TEXT,
                rank INTEGER,
                email varchar(255),
                website text,
                checkin JSONB,
                checkout varchar(50),
                descriptions JSONB,
                optional_fees text,
                facilities JSONB,
                policies text,
                attributes JSONB,
                added_date TIMESTAMPTZ,
                updated_date TIMESTAMPTZ,
                amenities JSONB,
                statistics JSONB,
                themes JSONB,
                spoken_languages JSONB,
                multi_unit BOOLEAN,
                payment_registration_recommended BOOLEAN,
                supply_source TEXT,
                created_at timestamp with time zone NOT NULL DEFAULT now(),
                updated_at timestamp with time zone NOT NULL DEFAULT now(),
                created_by int4 NULL,
                updated_by int4 NULL,
                is_deleted bool DEFAULT false,
                deleted_at timestamp with time zone DEFAULT null,
                CONSTRAINT hotel_info_pkey PRIMARY KEY (id),
                CONSTRAINT hotel_info_hotel_id_uniq UNIQUE (hotel_id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."hotel_info"');
  }
}
