import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ApiConfigService } from 'src/core/config/api-config.service';

@Injectable()
export class JwtService {
  constructor(private readonly apiConfigService: ApiConfigService) {}
  private readonly secretKey = this.apiConfigService.getString('SECRET_KEY');

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error(error);
    }
  }
}
