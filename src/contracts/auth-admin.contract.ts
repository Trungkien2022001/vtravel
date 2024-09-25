import { LoginDto, LoginResponseDto } from 'src/modules/admin-auth/dto';

export type TLoginAdminRequestDto = InstanceType<typeof LoginDto>;
export type TLoginAdminResponseDto = InstanceType<typeof LoginResponseDto>;
