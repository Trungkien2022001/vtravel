import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export class LoginDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'trungkien07yd@gmail.com',
    description: 'Username',
    minLength: 4,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  username: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'trungkien',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

class LoginResponse {
  @ApiProperty({
    required: true,
    type: String,
    description: 'Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
      'eyJ1c2VybmFtZSI6IjFAZ21haWwuY29tIiwiaWF0IjoxNzI2NTYwNDA2LCJleHAiOjE3MjY1NjQwMDZ9' +
      '.9su1JjvjU5QnMGBVeL0k2BjypELlAk2PILAlu3kZU24',
  })
  token: string;
}

export class LoginResponseDto extends BaseAPIResponseDTO<LoginResponse> {
  @ApiProperty({
    required: true,
    type: LoginResponse,
    description: 'Detail response!',
  })
  data: LoginResponse;
}
