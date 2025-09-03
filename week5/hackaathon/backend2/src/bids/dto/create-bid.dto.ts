import { IsMongoId, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDto {
  @ApiProperty({ example: "64f8c2c8f1a4b23c5f6a7e8d", description: "The ID of the car to bid on" })
  @IsMongoId()
  carId: string;

  @ApiProperty({ example: 55000, description: "The bid amount" })
  @IsNumber()
  amount: number;
}