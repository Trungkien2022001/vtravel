import { JwtService } from './jwt.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/database/entities';
import { AppError, compareHash } from 'src/common';
import { ERROR } from 'src/shared/constants';
import { UserRepository } from 'src/core/database/repositories';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
  ) {}

  async login(body: LoginDto) {
    // const user = await this.userRepository.findOne({
    //   where: {
    //     username: body.username,
    //     isDeleted: 0,
    //   },
    //   relations: {
    //     userRoles: {
    //       role: true,
    //     },
    //   },
    // });

    const data = await this.entityManager.query(
      `SELECT 
          u.id,
          u.username,
          u.password_hash,
          json_agg(
              json_build_object(
                  'role_id', r.id,
                  'name', r."name",
                  'is_deleted', ur.is_deleted
              )
          ) AS roles,
          u.created_at,
          u.updated_at
      FROM 
          "user" u
      INNER JOIN 
          user_role ur ON u.id = ur.user_id
      INNER JOIN 
          "role" r ON r.id = ur.role_id
      WHERE 
          u.username = $1
      GROUP BY 
          u.id;
      `,
      [body.username],
    );

    if (!data.length) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }

    const user = data[0];

    delete user.password_hash;

    const isValidPassword = await compareHash(body.password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError(ERROR.UNAUTHORIZED);
    }
    const token = this.jwtService.generateToken({
      username: body.username,
    });

    return {
      ...user,
      token,
    };
  }
}
