import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: createInventoryDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createInventoryDto.productId} not found`,
      );
    }

    return this.prisma.inventory.create({
      data: {
        productId: createInventoryDto.productId,
        quantity: createInventoryDto.quantity,
        reserved: createInventoryDto.reserved ?? 0,
      },
    });
  }

  async findByProductId(productId: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: {
        product: true,
      },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Inventory for product ID ${productId} not found`,
      );
    }

    return inventory;
  }

  async updateByProductId(productId: number, updateInventoryDto: UpdateInventoryDto) {
    await this.findByProductId(productId);

    return this.prisma.inventory.update({
      where: { productId },
      data: updateInventoryDto,
    });
  }
}
