import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('cart')
@ApiHeader({
  name: 'x-user-id',
  required: false,
  description: 'Simulated current user ID (defaults to 1)',
  example: '1',
})
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Helper to resolve current user ID from header or fallback to seed user 1
   */
  private getUserId(rawUserId?: string): number {
    return rawUserId ? parseInt(rawUserId, 10) : 1;
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a product to the current user cart' })
  addItem(
    @Headers('x-user-id') rawUserId: string | undefined,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const userId = this.getUserId(rawUserId);
    return this.cartService.addItem(userId, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user cart with items and product details' })
  getCart(@Headers('x-user-id') rawUserId: string | undefined) {
    const userId = this.getUserId(rawUserId);
    return this.cartService.getCart(userId);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItemQuantity(
    @Headers('x-user-id') rawUserId: string | undefined,
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const userId = this.getUserId(rawUserId);
    return this.cartService.updateItemQuantity(
      userId,
      cartItemId,
      updateCartItemDto,
    );
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove a specific item from the cart' })
  removeItem(
    @Headers('x-user-id') rawUserId: string | undefined,
    @Param('id', ParseIntPipe) cartItemId: number,
  ) {
    const userId = this.getUserId(rawUserId);
    return this.cartService.removeItem(userId, cartItemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all items from current user cart' })
  clearCart(@Headers('x-user-id') rawUserId: string | undefined) {
    const userId = this.getUserId(rawUserId);
    return this.cartService.clearCart(userId);
  }
}
