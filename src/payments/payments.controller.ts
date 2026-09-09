import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':orderId')
  @ApiOperation({ summary: 'Get payment status by order ID' })
  findByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.findByOrderId(orderId);
  }
}
