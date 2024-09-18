import { ERROR, JWT_ERROR } from 'src/shared/constants';
import { AppError } from '../errors';
import * as jwt from 'jsonwebtoken';

export class JwtService {
  static generateToken(payload: any): string {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRE_TIME,
    });
  }

  static verifyToken(token: string): any {
    if (!token) {
      throw new AppError(ERROR.MISSING_X_ACCESS_TOKEN);
    }
    try {
      return jwt.verify(token, process.env.SECRET_KEY);
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
