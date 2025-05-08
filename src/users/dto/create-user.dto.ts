import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User ID (UUID)' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'User bio', required: false })
  @IsString()
  @IsOptional()
  bio?: string;
}
