import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AppError } from 'src/common';
import { ApiConfigService } from 'src/core/config/api-config.service';
import { ERROR, JWT_ERROR } from 'src/shared/constants';

@Injectable()
export class JwtService {
  constructor(private readonly apiConfigService: ApiConfigService) {}
  private readonly secretKey = this.apiConfigService.getString('SECRET_KEY');
  private readonly expriredTime =
    this.apiConfigService.getString('EXPIRE_TIME');

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expriredTime });
  }

  verifyToken(token: string): any {
    if (!token) {
      throw new AppError(ERROR.MISSING_X_ACCESS_TOKEN);
    }
    try {
      return jwt.verify(token, this.secretKey);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      if (err.name === JWT_ERROR.TOKEN_EXPIRED) {
        throw new AppError(ERROR.TOKEN_EXPIRED);
      } else if (err.name === JWT_ERROR.INVALID_TOKEN) {
        throw new AppError(ERROR.INVALID_TOKEN);
      } else if (err.name === JWT_ERROR.NOT_BEFORE) {
        throw new AppError(ERROR.NOT_BEFORE);
      } else {
        throw new AppError(ERROR.INERNAL_SERVER_ERROR);
      }
    }
  }
}
