import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }


  async addItem(userId: number, dto: AddToCartDto) {
    return this.prisma.$transaction(async (tx) => {
      // Step A: Check if the user exists
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Step B: Check if product exists and fetch current inventory
      const product = await tx.product.findUnique({
        where: { id: dto.productId },
        include: { inventory: true },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${dto.productId} not found`);
      }
      if (!product.inventory) {
        throw new BadRequestException(
          `No inventory record found for product "${product.name}"`,
        );
      }

      // Step C: Find or create the user's cart
      let cart = await tx.cart.findUnique({
        where: { userId },
      });
      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      // Step D: Check if this product is already in the cart
      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: dto.productId,
          },
        },
      });

      // Calculate the final quantity desired in cart
      const finalQuantity = existingItem
        ? existingItem.quantity + dto.quantity
        : dto.quantity;

      // Step E: Validate available inventory against the combined quantity
      if (product.inventory.quantity < finalQuantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.inventory.quantity}, requested in cart: ${finalQuantity}`,
        );
      }

      // Step F: Either update existing CartItem or create a new one
      // Note: We do NOT decrease product.inventory here!
      if (existingItem) {
        return tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: finalQuantity },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        });
      } else {
        return tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId: dto.productId,
            quantity: dto.quantity,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        });
      }
    });
  }


  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                inventory: {
                  select: {
                    quantity: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      return {
        id: null,
        userId,
        items: [],
        totalItems: 0,
        subtotal: 0,
      };
    }

    const totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      id: cart.id,
      userId: cart.userId,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: cart.items,
      totalItems,
      subtotal: Number(subtotal.toFixed(2)),
    };
  }


  async updateItemQuantity(
    userId: number,
    cartItemId: number,
    dto: UpdateCartItemDto,
  ) {
    // Step A: Find the cart item with its cart and product inventory
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: {
          include: { inventory: true },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    // Step B: Ownership verification
    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this cart item',
      );
    }

    // Step C: Check stock before increasing
    if (
      cartItem.product.inventory &&
      cartItem.product.inventory.quantity < dto.quantity
    ) {
      throw new BadRequestException(
        `Insufficient stock for "${cartItem.product.name}". Available: ${cartItem.product.inventory.quantity}, requested: ${dto.quantity}`,
      );
    }

    // Step D: Update the quantity
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: dto.quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
  }


  async removeItem(userId: number, cartItemId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    // Ownership verification
    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this cart item',
      );
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return {
      message: `Cart item ${cartItemId} successfully removed`,
      removedItemId: cartItemId,
    };
  }


  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return {
        message: 'Cart is already empty',
        clearedCount: 0,
      };
    }

    const result = await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      message: 'Cart successfully cleared',
      clearedCount: result.count,
    };
  }
}
