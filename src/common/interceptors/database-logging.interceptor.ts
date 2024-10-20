import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActionLogs } from 'src/core/database/entities';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseLoggingInterceptor implements NestInterceptor {
  constructor(private readonly connection: Connection) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, originalUrl } = request;

    return next.handle().pipe(
      tap((response) => {
        const actionLog = new ActionLogs();
        actionLog.path = url;
        actionLog.matchedRoute = originalUrl;
        actionLog.clientIp = ip;
        actionLog.user = request.user?.id || 'Anonymous';
        actionLog.method = method;
        actionLog.header = JSON.stringify(request.headers);
        actionLog.status = response?.statusCode || 200;
        actionLog.request = JSON.stringify(request.body);
        actionLog.response = JSON.stringify(response);
        actionLog.error = response?.stack;
        actionLog.errorCode = response?.code;

        this.connection.getRepository(ActionLogs).save(actionLog);
      }),
    );
  }
}
