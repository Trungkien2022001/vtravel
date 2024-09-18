import {
  CreateAdminAccountDto,
  CreateAdminAccountResponseDto,
} from 'src/modules/user-admin/dto';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export type TEntryPointRequestDto = never;
export type TEntryPointResponseDto = InstanceType<typeof BaseAPIResponseDTO>;

export type TCreateAdminAccountRequestDto = InstanceType<
  typeof CreateAdminAccountDto
>;
export type TCreateAdminAccountResponseDto = InstanceType<
  typeof CreateAdminAccountResponseDto
>;

export type TGetListAgentRequestDto = any;
export type TGetListAgentResponseDto = any;

export type TGetMyInfoRequestDto = any;
export type TGetMyInfoResponseDto = any;

export type TUpdadeAgentRequestDto = any;
export type TUpdadeAgentResponseDto = any;
