import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'john_doe', description: 'Unique username' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'password123', description: 'Strong password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '0300-000000', description: 'Phone number' })
  @IsString()
  @Matches(/^[0-9]{4}-[0-9]{6}$/, { message: 'Mobile number must match format 0300-000000' })
  mobileNumber: string;
}
