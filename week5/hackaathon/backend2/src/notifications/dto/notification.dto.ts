import { IsMongoId, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ enum: ['start','end','win','new'] })
  @IsEnum(['start','end','win','new'])
  type: string;

  @ApiProperty({ description: 'Sender User ID', example: '64f02b3c123abc456def7890' })
  @IsMongoId()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ description: 'Receiver User ID', example: '64f02b3c123abc456def7891' })
  @IsMongoId()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({ description: 'Optional comment' })
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: 'Car ID', required: false, example: '64f02b3c123abc456def7892' })
  @IsOptional()
  @IsMongoId()
  car?: string;

  @ApiProperty({ description: 'Bid ID', required: false, example: '64f02b3c123abc456def7893' })
  @IsOptional()
  @IsMongoId()
  bid?: string;
}
