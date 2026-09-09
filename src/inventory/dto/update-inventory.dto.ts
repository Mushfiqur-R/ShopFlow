import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateInventoryDto {
  @ApiPropertyOptional({ description: 'Available stock quantity', example: 150 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'quantity must be an integer' })
  @Min(0, { message: 'quantity cannot be negative' })
  quantity?: number;

  @ApiPropertyOptional({ description: 'Reserved stock quantity', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'reserved must be an integer' })
  @Min(0, { message: 'reserved quantity cannot be negative' })
  reserved?: number;
}
