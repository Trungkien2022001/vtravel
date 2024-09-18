import { LoginDto, LoginResponseDto } from 'src/modules/auth-admin/dto';

export type TLoginAdminRequestDto = InstanceType<typeof LoginDto>;
export type TLoginAdminResponseDto = InstanceType<typeof LoginResponseDto>;
