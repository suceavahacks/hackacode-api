import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token from previous auth' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
} 