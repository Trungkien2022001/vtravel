import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as i18n from 'i18n';
import { ActionLogs } from '../entities/collections';
import { Connection } from 'typeorm';
import { EStandardError } from 'src/shared/enums';
import { ERROR } from 'src/shared/constants';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  constructor(
    // @InjectRepository(ActionLogs)
    // private readonly actionLogsRepo: ActionLogsRepository
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
    actionLog.error = exception.stack;
    actionLog.errorCode =
      exception.code || EStandardError.INTERNAL_SERVER_ERROR;

    this.connection.getRepository(ActionLogs).save(actionLog);

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
