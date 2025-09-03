import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Length } from 'class-validator';
export class RequestResetDto { @ApiProperty() @IsEmail() email: string; }
export class PerformResetDto { @ApiProperty() @IsEmail() email: string; @ApiProperty() @IsString() @Length(6,6) code: string; @ApiProperty() @IsString() @MinLength(6) newPassword: string; }
