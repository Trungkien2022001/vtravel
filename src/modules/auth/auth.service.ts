import { JwtService } from './jwt.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/core/database/entities';
import { AppError } from 'src/common';
import { ERROR } from 'src/shared/constants';
import { UserRepository } from 'src/core/database/repositories';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: body.username,
        isDeleted: 0,
      },
      relations: {
        userRoles: {
          role: true,
        },
      },
    });

    if (!user) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }

    const isValidPassword = await this.compareHash(
      body.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }
    const token = this.jwtService.generateToken({
      username: body.username,
    });

    return {
      email: body.username,
      token,
    };
  }

  async compareHash(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
