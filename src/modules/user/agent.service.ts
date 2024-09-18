import { Injectable } from '@nestjs/common';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateUserDto } from './dto/update-agent.dto';

@Injectable()
export class UserService {
  create(createAgentDto: CreateAgentDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return 'This action returns all user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
