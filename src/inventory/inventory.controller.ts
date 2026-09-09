import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create initial inventory for a product' })
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory details for a product' })
  findByProductId(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.findByProductId(productId);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update inventory details for a product' })
  updateByProductId(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateByProductId(productId, updateInventoryDto);
  }
}
