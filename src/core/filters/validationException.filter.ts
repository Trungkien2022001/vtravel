/* eslint-disable no-param-reassign */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as i18n from 'i18n';
import { Connection } from 'typeorm';
import { ActionLogs } from '../database/entities';
import { ERROR } from 'src/shared/constants';

function collectValidationErrors(exception: any): any {
  if (exception.constraints) {
    for (const key in exception.constraints) {
      if (exception.constraints.hasOwnProperty(key)) {
        return {
          errorMessage: exception.constraints[key],
          errorProperty: exception.property,
          errorValue: exception.value,
        };
      }
    }
  }

  if (exception.children && exception.children.length > 0) {
    for (const child of exception.children) {
      const result = collectValidationErrors(child);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly connection: Connection) {}
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const now = Date.now();

    let language = 'vi';
    if (request.headers['accept-language'] === 'en') {
      language = 'en';
    }
    const { errorMessage, errorProperty, errorValue } =
      collectValidationErrors(exception);

    Logger.error(
      `Api ${request.method} ${request.url} - ${Date.now() - now}ms 
            ${errorMessage}`,
    );
    Logger.error(request.body);

    // tslint:disable-next-line:forin

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
    actionLog.error = errorMessage; // Giả sử 'msg' là biến chứa thông tin lỗi
    actionLog.errorCode = ERROR.VALIDATION_ERROR;

    this.connection.getRepository(ActionLogs).save(actionLog);

    const errTitle = i18n.__({
      phrase: ERROR.VALIDATION_ERROR,
      locale: language,
    });

    response.status(HttpStatus.OK).send({
      status: 'error',
      code: ERROR.VALIDATION_ERROR,
      message: `${errTitle}: ${errorMessage}. Error key: ${errorProperty}. Value: ${typeof errorValue !== 'object' ? errorValue : JSON.stringify(errorValue)}`,
    });
  }
}
