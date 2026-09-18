import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'New quantity for the cart item (minimum 1)',
    example: 3,
  })
  @Type(() => Number)
  @IsInt({ message: 'quantity must be an integer' })
  @IsPositive({ message: 'quantity must be greater than 0' })
  quantity: number;
}
