import { IsBoolean, IsOptional, IsNumber, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateSaleDto {
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true') // converts JSON or FormData
  sale: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  @IsOptional()
  @IsString()
  saleEnd?: string; // ISO string
}
