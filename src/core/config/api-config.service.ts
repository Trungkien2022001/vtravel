import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import * as dotenv from 'dotenv';
import * as entities from 'src/core/database/entities';

dotenv.config();

@Injectable()
export class ApiConfigService {
  constructor(public configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  public getAdminKey(key: string): string {
    return this.getString(key);
  }

  public getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  public getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  public getString(key: string): string {
    const value: string = this.get(key);

    return value;
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get mysqlConfig(): TypeOrmModuleOptions {
    //TODO define entity
    const entities: string[] = [];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    const host = this.configService.get<string>('DATABASE_HOST', 'localhost');
    const port = this.configService.get<number>('DATABASE_PORT', 3306);
    const username = this.configService.get<string>(
      'DATABASE_USERNAME',
      'root',
    );
    const password = this.configService.get<string>('DATABASE_PASSWORD', '');
    const database = this.configService.get<string>('DATABASE_NAME', 'aution');
    // const type = this.configService.get<string>('DATABASE_TYPE', 'mysql');
    const synchronize = false;

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'mysql',
      name: 'default',
      host,
      port,
      username,
      password,
      database,
      subscribers: [],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      synchronize,
    };
  }

  get posgresConfig(): TypeOrmModuleOptions {
    // const entities = ['dist/**/*.entity{.ts,.js}'];
    const migrations = [__dirname + '/migrations/**/*{.ts,.js}'];
    const seeds = [__dirname + '/seeds/**/*{.ts,.js}'];

    const host = this.configService.get<string>('DATABASE_HOST', 'localhost');
    const port = this.configService.get<number>('DATABASE_PORT', 6432);
    const username = this.configService.get<string>(
      'DATABASE_USERNAME',
      'root',
    );
    const password = this.configService.get<string>('DATABASE_PASSWORD', '');
    const database = this.configService.get<string>('DATABASE_NAME', 'aution');
    // const type = this.configService.get<string>('DATABASE_TYPE', 'mysql');
    const synchronize = false;

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host,
      port,
      username,
      password,
      database,
      subscribers: [],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      seeds,
      factories: [__dirname + '/factories/**/*{.ts,.js}'],
      cli: {
        migrationsDir: __dirname + '/migrations/',
      },
      synchronize,
    } as unknown as TypeOrmModuleOptions;
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  public get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }
}
