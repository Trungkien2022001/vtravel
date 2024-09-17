import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
export const OrmDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'advanced-console',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/core/database/migrations/**/*.ts'],
  subscribers: ['src/core/database/subscriber/**/*.ts'],
  migrationsTableName: 'migrations',
});
