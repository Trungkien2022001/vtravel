import { CreateAgentDto, CreateAgentResponseDto } from 'src/modules/user/dto';

export type TCreateAgentnAccountRequestDto = InstanceType<
  typeof CreateAgentDto
>;
export type TCreateAgentnAccountResponseDto = InstanceType<
  typeof CreateAgentResponseDto
>;
