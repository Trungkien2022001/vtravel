import { LoginDto, LoginResponseDto } from 'src/modules/agent-auth/dto';

export type TLoginAgentRequestDto = InstanceType<typeof LoginDto>;
export type TLoginAgentResponseDto = InstanceType<typeof LoginResponseDto>;
