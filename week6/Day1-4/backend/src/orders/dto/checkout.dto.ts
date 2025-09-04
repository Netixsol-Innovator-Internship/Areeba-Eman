import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({
    type: Object,
    description: 'Address information',
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
  })
  @IsObject()
  addressInfo: any;

  @ApiProperty({
    type: Object,
    description: 'Payment information',
    example: { method: 'card', transactionId: 'TXN123456' },
  })
  @IsObject()
  paymentInfo: any;

  @ApiProperty({
    type: Boolean,
    description: 'Use loyalty points if available',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  usePoints?: boolean;
}
