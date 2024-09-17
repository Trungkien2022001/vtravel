import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as i18n from 'i18n';
import { ActionLogs } from '../entities/collections';
import { Connection } from 'typeorm';
import { AppDataError } from 'src/common';

@Catch(AppDataError)
export class AppDataExceptionFilter implements ExceptionFilter {
  constructor(private readonly connection: Connection) {}

  catch(exception: AppDataError, host: ArgumentsHost) {
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

    const actionLog = new ActionLogs();
    actionLog.clientIp = request.ip;
    actionLog.path = request.url;
    actionLog.matchedRoute = request.originalUrl;
    actionLog.user = request.user ? JSON.stringify(request.user) : 'Anonymous';
    actionLog.method = request.method;
    actionLog.status = response.statusCode || 200;
    actionLog.request = JSON.stringify({
      body: request.body,
      params: request.params,
    });
    actionLog.header = JSON.stringify(request.headers);
    actionLog.error = exception.stack || null;
    actionLog.errorCode = exception.code;

    this.connection.getRepository(ActionLogs).save(actionLog);

    response.status(HttpStatus.OK).send({
      status: 'error',
      code: exception.code,
      message: i18n.__({
        phrase: exception.code,
        locale: language,
      }),
      data: exception.data,
    });
  }
}
