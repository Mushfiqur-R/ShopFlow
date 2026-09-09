import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrderId(orderId: number) {
    return this.prisma.notification.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
