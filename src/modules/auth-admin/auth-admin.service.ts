import { Injectable } from '@nestjs/common';
import { AppError, compareHash, JwtService } from 'src/common';
import { ERROR, WORKSPACE } from 'src/shared/constants';
import { EntityManager } from 'typeorm';
import { LoginDto } from './dto';
import { TLoginAdminRequestDto } from 'src/contracts';

@Injectable()
export class AuthAdminService {
  constructor(private readonly entityManager: EntityManager) {}

  async login(body: LoginDto): Promise<TLoginAdminRequestDto> {
    const data = await this.entityManager.query(
      `SELECT 
          u.id,
          u.username,
          u.password_hash,
          json_agg(
              json_build_object(
                  'id', r.id,
                  'name', r."name"
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
          AND u.is_deleted = false
      GROUP BY 
          u.id;
      `,
      [body.username],
    );

    if (!data.length) {
      throw new AppError(ERROR.INVALID_CREDENTIAL);
    }

    const user = data[0];

    const isValidPassword = await compareHash(
      body.password,
      user.password_hash,
    );
    if (!isValidPassword) {
      throw new AppError(ERROR.INVALID_CREDENTIAL);
    }
    delete user.password_hash;
    const token = JwtService.generateToken({
      id: user.id,
      workspace: WORKSPACE.ADMIN,
    });

    return {
      ...user,
      token,
    };
  }
}
