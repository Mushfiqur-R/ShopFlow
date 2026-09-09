import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ description: 'ID of the associated product', example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'productId must be an integer' })
  @IsNotEmpty({ message: 'productId is required' })
  productId: number;

  @ApiProperty({ description: 'Available stock quantity', example: 100 })
  @Type(() => Number)
  @IsInt({ message: 'quantity must be an integer' })
  @Min(0, { message: 'quantity cannot be negative' })
  quantity: number;

  @ApiPropertyOptional({ description: 'Reserved stock quantity', example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'reserved must be an integer' })
  @Min(0, { message: 'reserved quantity cannot be negative' })
  reserved?: number;
}
