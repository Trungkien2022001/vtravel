import { LoginDto, LoginResponseDto } from 'src/modules/auth-agent/dto';

export type TLoginAgentRequestDto = InstanceType<typeof LoginDto>;
export type TLoginAgentResponseDto = InstanceType<typeof LoginResponseDto>;
