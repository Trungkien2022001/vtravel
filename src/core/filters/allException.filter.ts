import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as i18n from 'i18n';
import { Connection } from 'typeorm';
import { EStandardError } from 'src/shared/enums';
import { ERROR } from 'src/shared/constants';
import { ErrorLogs } from '../database/entities';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  constructor(
    // @InjectRepository(ErrorLogs)
    // private readonly ErrorLogsRepo: ErrorLogsRepository
    private readonly connection: Connection,
  ) {}

  catch(exception: Error | HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const now = Date.now();
    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : null;

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
    errorLog.error = exception.stack;
    errorLog.errorCode = exception.code || EStandardError.INTERNAL_SERVER_ERROR;

    this.connection.getRepository(ErrorLogs).save(errorLog);

    if (httpStatus === 401) {
      return response.status(HttpStatus.UNAUTHORIZED).send({
        status: 'error',
        code: ERROR.USER_NOT_AUTHENTICATED,
        message: i18n.__({
          phrase: ERROR.USER_NOT_AUTHENTICATED,
          locale: language,
        }),
      });
    }

    if (httpStatus === 403) {
      return response.status(HttpStatus.FORBIDDEN).send({
        status: 'error',
        code: ERROR.FORBIDDEN_TO_ACCESS,
        message: i18n.__({
          phrase: ERROR.FORBIDDEN_TO_ACCESS,
          locale: language,
        }),
      });
    }

    response.status(HttpStatus.OK).send({
      status: 'error',
      code: httpStatus === 404 ? ERROR.NOT_FOUND : ERROR.INERNAL_SERVER_ERROR,
      message: i18n.__({
        phrase:
          httpStatus === 404 ? ERROR.NOT_FOUND : ERROR.INERNAL_SERVER_ERROR,
        locale: language,
      }),
    });
  }
}
