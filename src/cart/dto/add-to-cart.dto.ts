import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID of the product to add to cart',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'productId must be an integer' })
  @IsNotEmpty({ message: 'productId is required' })
  productId: number;

  @ApiProperty({
    description: 'Quantity to add to cart (minimum 1)',
    example: 2,
    default: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'quantity must be an integer' })
  @IsPositive({ message: 'quantity must be greater than 0' })
  quantity: number;
}
