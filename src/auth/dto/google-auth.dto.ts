import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  // Empty DTO as we'll get redirect URL from environment variables
}

export class GoogleCallbackDto {
  @ApiProperty({ 
    description: 'Code returned from OAuth provider after user authorization',
    example: '4/0AdQt8qg_Xbz2t-OwSs_f3M7JFVUQzrn_wWv0O5FhQgwVk6FWgCJGn7W6FTgfJ3Kw9n2y' 
  })
  @IsString()
  @IsNotEmpty()
  code: string;
  
  @ApiProperty({ 
    description: 'State param passed for CSRF protection',
    example: 'random-state-string' 
  })
  @IsString()
  @IsNotEmpty()
  state: string;
} 