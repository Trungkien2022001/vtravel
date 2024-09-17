import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ApiConfigService } from 'src/core/config/api-config.service';

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
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error(error);
    }
  }
}
