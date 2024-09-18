import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor, TransformInterceptor, TrimPipe } from './common';
import { initializeTransactionalContext } from 'typeorm-transactional';

import helmet from 'helmet';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as i18n from 'i18n';
import { ValidationError } from 'class-validator';

i18n.configure({
  locales: ['en', 'vi'],
  directory: path.join(__dirname, 'shared', 'locales'),
});

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<INestApplication>(AppModule);

  app.enableCors();
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('APP Service API')
    .setDescription('APP Service API Doccument')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${process.env.API_PREFIX}/docs`, app, document);
  // Logger.log(
  //   `Swagger Documents Url: http://localhost:${process.env.API_PORT}/${process.env.API_PREFIX}/docs`,
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return errors[0];
      },
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  app.useGlobalPipes(new TrimPipe());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  await app.listen(process.env.API_PORT || 3030);
  Logger.log(
    `🚀 Application is running on: http://localhost:${process.env.API_PORT}/${process.env.API_PREFIX}`,
  );
}
bootstrap();
