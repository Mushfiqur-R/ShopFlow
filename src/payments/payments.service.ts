import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrderId(orderId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment record for order ID ${orderId} not found`,
      );
    }

    return payment;
  }
}
