import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Areeba Eman' })
  @IsOptional() @IsString() fullName?: string;

  @ApiPropertyOptional({ example: 'areeba@example.com' })
  @IsOptional() @IsEmail() email?: string;

  @ApiPropertyOptional({ example: '+923001234567' })
  @IsOptional() @IsString() mobileNumber?: string;

  @ApiPropertyOptional({ example: 'Pakistani' })
  @IsOptional() @IsString() nationality?: string;

  @ApiPropertyOptional({ example: 'CNIC' })
  @IsOptional() @IsString() idType?: string;

  @ApiPropertyOptional({ example: '35201-1234567-8' })
  @IsOptional() @IsString() idNo?: string;

  @ApiPropertyOptional({ example: 'House 123, Street 45' })
  @IsOptional() @IsString() address1?: string;

  @ApiPropertyOptional({ example: 'Near City Mall' })
  @IsOptional() @IsString() address2?: string;

  @ApiPropertyOptional({ example: 'fsd' })
  @IsOptional() @IsString() city?: string;

  @ApiPropertyOptional({ example: 'Pakistan' })
  @IsOptional() @IsString() country?: string;

  @ApiPropertyOptional({ example: '042-1234567' })
  @IsOptional() @IsString() landline?: string;

  @ApiPropertyOptional({ example: '54000' })
  @IsOptional() @IsString() poBox?: string;

  @ApiPropertyOptional({ example: 'Car' })
  @IsOptional() @IsString() trafficInformationType?: string;

  @ApiPropertyOptional({ example: 'TF123456' })
  @IsOptional() @IsString() trafficFileNo?: string;

  @ApiPropertyOptional({ example: 'Punjab' })
  @IsOptional() @IsString() plateState?: string;

  @ApiPropertyOptional({ example: 'LEA' })
  @IsOptional() @IsString() plateCode?: string;

  @ApiPropertyOptional({ example: '1234' })
  @IsOptional() @IsString() plateNumber?: string;

  @ApiPropertyOptional({ example: 'DLN987654' })
  @IsOptional() @IsString() driverLicenseNumber?: string;

  @ApiPropertyOptional({ example: 'Karachi' })
  @IsOptional() @IsString() issueCity?: string;

  @ApiPropertyOptional({ example: 'StrongPassword123' })
  @IsOptional() @IsString() password?: string;
}

