import { UserRoleRepository } from './../../core/database/repositories/user-role.repository';
import { RoleRepository, UserRepository } from 'src/core/database/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { CreateAdminAccountDto, UpdateAdminDto } from './dto';
import { AppError, hashPassword } from 'src/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import {
  DEFAULT_ADMIN_ROLE,
  DEFAULT_PASSWORD,
  DEFAULT_USERNAME,
  ERROR,
} from 'src/shared/constants';
import { EntityManager } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { IAdmin } from 'src/contracts';

@Injectable()
export class UserAdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,

    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: UserRoleRepository,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: RoleRepository,

    private readonly entityManager: EntityManager,
  ) {}

  @Transactional()
  async entrypoint(): Promise<any> {
    const username = DEFAULT_USERNAME;
    const password = DEFAULT_PASSWORD;
    const defaultRole = DEFAULT_ADMIN_ROLE;
    const exitedUser = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (exitedUser) {
      throw new AppError(ERROR.USER_ALREADY_EXISTED);
    }
    const passwordHash = hashPassword(password);
    // await this.entityManager.transaction()
    const newUser = await this.userRepository.insert({
      username,
      passwordHash,
    });

    const userId = newUser.identifiers[0].id;

    Logger.log('New user: ', userId);
    let roleId;
    try {
      const newRole = await this.roleRepository.insert(defaultRole);

      roleId = newRole.identifiers[0].id;
      Logger.log('New role id: ', roleId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(ERROR.ROLE_ALREADY_EXISTED);
    }

    try {
      await this.userRoleRepository.insert({
        userId,
        roleId,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(ERROR.INERNAL_SERVER_ERROR);
    }

    return {
      id: userId,
    };
  }

  @Transactional()
  async create(body: CreateAdminAccountDto, adminId: number): Promise<any> {
    const { username, password, role_ids: roleIds } = body;
    const exitedUser = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (exitedUser) {
      throw new AppError(ERROR.USER_ALREADY_EXISTED);
    }
    const passwordHash = hashPassword(password);
    // await this.entityManager.transaction()
    const newUser = await this.userRepository.insert({
      username,
      passwordHash,
      createdBy: adminId,
      updatedBy: adminId,
    });

    const newUserId = newUser.identifiers[0].id;
    Logger.log('New userID: ', newUserId);
    try {
      await this.userRoleRepository.insert(
        roleIds.map((roleId) => ({
          userId: newUserId,
          roleId,
          createdBy: adminId,
          updatedBy: adminId,
        })),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(ERROR.ROLE_NOT_FOUND);
    }

    return {
      id: newUserId,
    };
  }

  findAll() {
    return 'This action returns all user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateAdminDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getBasicInfoByUserId(id: number) {
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
          u.id = $1
          and ur.is_deleted = false
          and r.is_deleted = false
      GROUP BY 
          u.id;
      `,
      [id],
    );

    if (!data.length) {
      throw new AppError(ERROR.USER_NOTFOUND);
    }

    return data[0] as IAdmin;
  }
}
