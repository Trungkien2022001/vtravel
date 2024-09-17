import { JwtService } from './jwt.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/shared/entities';
import { AppError } from 'src/common';
import { ERROR } from 'src/shared/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.username,
        delFlag: 0,
      },
    });
    if (!user) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }

    const isValidPassword = await this.compareHash(
      loginDto.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }
    const token = this.jwtService.generateToken({
      username: loginDto.username,
    });

    return {
      email: loginDto.username,
      token,
    };
  }

  async compareHash(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
