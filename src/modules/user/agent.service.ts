import { AgentRepository } from './../../core/database/repositories';
import { Injectable, Logger } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateUserDto } from './dto/update-agent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentEntity, AgentResourceEntity } from 'src/core/database/entities';
import { EntityManager } from 'typeorm';
import { AgentResourceRepository } from 'src/core/database/repositories/agent-resource.repository';
import { AppError } from 'src/common';
import { AGENT_ERROR } from 'src/shared/constants/agent-error.constant';
import { Transactional } from 'typeorm-transactional';
import { RedisService } from 'src/core';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly agentRepository: AgentRepository,
    @InjectRepository(AgentResourceEntity)
    private readonly agentResourceRepository: AgentResourceRepository,
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}

  @Transactional()
  async create(createAgentDto: CreateAgentDto, adminId: number) {
    const { username, password, resource_ids: resourceIds } = createAgentDto;
    const existedAgent = await this.agentRepository.findOne({
      where: {
        username,
      },
    });

    if (existedAgent) {
      throw new AppError(AGENT_ERROR.AGENT_ALREADY_EXISTED);
    }

    const newAgent = await this.agentRepository.insert({
      username,
      password,
      createdBy: adminId,
      updatedBy: adminId,
    });

    const newAgentId = newAgent.identifiers[0].id;
    Logger.log('New AgentID: ', newAgentId);
    try {
      await this.agentResourceRepository.insert(
        resourceIds.map((resourceId) => ({
          agentId: newAgentId,
          resourceId,
          createdBy: adminId,
          updatedBy: adminId,
        })),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(AGENT_ERROR.RESOURCE_NOT_FOUND);
    }

    return {
      id: newAgentId,
    };
  }

  async getAgentResources(agentId: number): Promise<any> {
    const data = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.AGENT_RESOURCES}:${agentId}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      this.entityManager.query(
        `SELECT
            a.id,
            a.username,
            json_agg(
                json_build_object(
                    'id', r.id,
                    'name', r."name"
                )
            ) AS roles
        FROM
            "agent" a
        INNER JOIN
            agent_resource ar ON a.id = ar.agent_id
        INNER JOIN
            "resource" r ON r.id = ar.resource_id
        WHERE
            a.id = $1
            and ar.is_deleted = false
            and r.is_deleted = false
        GROUP BY
            a.id;
        `,
        [agentId],
      ),
    );
    if (!data.length) {
      throw new AppError(AGENT_ERROR.AGENT_NOTFOUND);
    }

    return data[0];
  }

  findAll() {
    return 'This action returns all user';
  }

  async findOne(agentId: number) {
    return await this.getAgentResources(agentId);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
