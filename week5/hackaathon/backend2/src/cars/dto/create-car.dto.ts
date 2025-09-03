import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCarDto {
  @ApiProperty({ example: 'individual', description: 'Seller type: individual or dealer' })
  @IsIn(['individual', 'dealer'])
  sellerType: string;

  @ApiPropertyOptional({ example: 'John', description: 'Seller first name' })
  @IsOptional() @IsString()
  sellerFirstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'Seller last name' })
  @IsOptional() @IsString()
  sellerLastName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Seller email address' })
  @IsOptional() @IsString()
  sellerEmail?: string;

  @ApiPropertyOptional({ example: '+971501234567', description: 'Seller phone number' })
  @IsOptional() @IsString()
  sellerPhone?: string;

  @ApiProperty({ example: '1HGCM82633A004352', description: 'Vehicle Identification Number' })
  @IsString()
  vin: string;

  @ApiProperty({ example: 2022, description: 'Manufacturing year' })
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiProperty({ example: 'Toyota', description: 'Car make' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'Camry', description: 'Car model' })
  @IsString()
  model: string;

  @ApiPropertyOptional({ example: 45000, description: 'Mileage in kilometers' })
  @IsOptional() @IsNumber()
  @Type(() => Number) 
  mileage?: number;

  @ApiPropertyOptional({ example: '2.5L', description: 'Engine size' })
  @IsOptional() @IsString()
  engineSize?: string;

  @ApiProperty({ example: 'White', description: 'Car paint color' })
  @IsString()
  paint: string;

  @ApiPropertyOptional({ example: true, description: 'Does the car have GCC specs?' })
  @IsOptional()
  hasGccSpecs?: boolean;

  @ApiPropertyOptional({ example: 'Sunroof, Leather seats', description: 'Noteworthy options' })
  @IsOptional() @IsString()
  noteworthyOptions?: string;

  @ApiPropertyOptional({ example: false, description: 'Accident history (true/false)' })
  @IsOptional()
  accidentHistory?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Full service history available' })
  @IsOptional()
  fullServiceHistory?: boolean;

  @IsOptional()
  @IsIn(['stock', 'modified'])
  modification?: string;

  @ApiProperty({ example: 50000, description: 'Maximum bid amount' })
  @IsNumber()
  @Type(() => Number) 
  maxBid: number;

  @ApiPropertyOptional({ example: 'upcoming', description: 'Car status (upcoming/live/sold)' })
  @IsOptional() @IsString()
  status?: string;

  // FILE UPLOAD FIELD (Swagger only)
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Upload up to 6 photos',
    required: false,
  })
  photos?: any; // Do NOT validate with class-validator
}
