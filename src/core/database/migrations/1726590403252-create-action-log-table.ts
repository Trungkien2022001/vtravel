import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActionLogTable1726590403252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.action_logs (
                id serial4 NOT NULL,
                "path" varchar(200) DEFAULT ''::character varying NOT NULL,
                matched_route varchar(500) DEFAULT ''::character varying NOT NULL,
                client_ip varchar(50) DEFAULT '0.0.0.0'::character varying NOT NULL,
                "user" varchar(1000) DEFAULT 'Anonymos'::character varying NOT NULL,
                "method" varchar(10) DEFAULT ''::character varying NOT NULL,
                status int4 DEFAULT 200 NOT NULL,
                request text NULL,
                response text NULL,
                error text NULL,
                error_code varchar(100) DEFAULT ''::character varying NULL,
                created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "header" text NULL,
                CONSTRAINT action_logs_pkey PRIMARY KEY (id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."action_logs"');
  }
}
