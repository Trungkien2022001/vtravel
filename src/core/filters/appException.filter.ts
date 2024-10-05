import { Connection } from 'typeorm';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as i18n from 'i18n';
import { ErrorLogs } from '../database/entities';
import { AppError } from 'src/common';

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly connection: Connection) {}

  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const now = Date.now();

    let language = 'vi';
    if (request.headers['accept-language'] === 'en') {
      language = 'en';
    }

    Logger.error(
      `Api ${request.method} ${request.url} - ${Date.now() - now}ms 
            ERROR_CODE: ${exception.code}
            ${exception.stack}`,
    );
    Logger.error(request.body);

    const errorLog = new ErrorLogs();
    errorLog.clientIp = request.ip;
    errorLog.path = request.url;
    errorLog.matchedRoute = request.originalUrl;
    errorLog.user = request.user ? JSON.stringify(request.user) : 'Anonymous';
    errorLog.method = request.method;
    errorLog.status = response.statusCode || 200;
    errorLog.request = JSON.stringify({
      body: request.body,
      params: request.params,
    });
    errorLog.header = JSON.stringify(request.headers);
    errorLog.error = exception.stack || null;
    errorLog.errorCode = exception.code;

    this.connection.getRepository(ErrorLogs).save(errorLog);

    response.status(HttpStatus.OK).send({
      status: 'error',
      code: exception.code,
      message: i18n.__({
        phrase: exception.code,
        locale: language,
      }),
    });
  }
}
