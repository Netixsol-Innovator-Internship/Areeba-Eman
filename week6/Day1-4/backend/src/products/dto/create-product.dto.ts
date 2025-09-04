import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';


export class CreateProductDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty()
  @IsNumber()
   @Type(() => Number)
  price: number;

  @ApiProperty({ enum: ['shirts','jeans','tshirts','hoodies','shorts'] })
  @IsString()
   types: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  stockQuantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number) 
  salePrice?: number;

  @ApiPropertyOptional({ enum: ['male','female'] })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['casual','formal','party','gym'] })
  @IsOptional() 
  @IsString() 
  style?: string;

  @ApiPropertyOptional({ type: [String] }) 
  @IsOptional() 
  @IsArray() 
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v) => v.trim()) // split into an array
      : value,
  )
  size?: string[];

  // NEW
  @ApiPropertyOptional() 
  @IsOptional() 
  @IsNumber() 
  @Type(() => Number)
  loyaltyPoints?: number;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsNumber() 
    @Type(() => Number)
  pointsPrice?: number;
}
