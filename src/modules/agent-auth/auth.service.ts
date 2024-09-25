import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentEntity } from 'src/core/database/entities';
import { AppError, JwtService } from 'src/common';
import {
  ERROR,
  REDIS_EXPIRED,
  REDIS_KEY,
  WORKSPACE,
} from 'src/shared/constants';
import { RedisService } from 'src/core';
import { AgentRepository } from 'src/core/database/repositories';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly agentRepository: AgentRepository,
    private readonly redisService: RedisService,
  ) {}

  async login(body: LoginDto) {
    const { username, password } = body;

    const user = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.AGENT_LOGIN}:${username}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      () =>
        this.agentRepository.findOne({
          where: {
            username,
            isDeleted: 0,
          },
          select: ['password', 'id'],
        }),
    );

    if (!user) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }

    const isValidPassword = password === user.password;
    if (!isValidPassword) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }
    const token = JwtService.generateToken({
      id: user.id,
      workspace: WORKSPACE.AGENT,
    });

    return {
      token,
    };
  }
}
