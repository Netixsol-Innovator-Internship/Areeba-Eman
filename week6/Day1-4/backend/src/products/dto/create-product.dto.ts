import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateProductDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsNumber() price: number;
  @ApiProperty({ enum: ['jeans','shirts','tshirts','hoodies','shorts'] }) @IsString() types: string;
  @ApiProperty() @IsNumber() stockQuantity: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() salePrice?: number;
  @ApiPropertyOptional({ enum: ['male','female'] }) @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional({ enum: ['casual','formal','party','gym'] }) @IsOptional() @IsString() style?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() size?: string[];
}
