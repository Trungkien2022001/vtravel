import { PartialType } from '@nestjs/swagger';
import { CreateAgentDto } from './create-agent.dto';

export class UpdateUserDto extends PartialType(CreateAgentDto) {}
