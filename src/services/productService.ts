import prisma, { Prisma } from '../config/prisma';
import { HttpError } from '../types/error';
import { PaginatedResponseDto } from '../types/common';
import {
  CreateProductDto,
  PatchProductDto,
  ProductDto,
  SimpleProductDto,
  ProductWithLikeDto
} from '../types/product';


const ProductService = {
  async getProductList(offset: number = 0, limit: number = 10, orderBy: 'asc' | 'desc' = 'desc', keyword: string = ''): Promise<PaginatedResponseDto<SimpleProductDto>> {
    const where: Prisma.ProductWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ]
    }
    const data = await prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: orderBy,
      },
      where,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      }
    })
    const total = await prisma.product.count({
      where,
    })
    const pages = Math.ceil(total / limit);
    return {
      data,
      meta: {
        total,
        pages,
        offset,
        limit,
      }
    }
  },

  async getProduct(id: string): Promise<ProductDto> {
    const data = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        userId: true,
      }
    })
    if (!data) {
      throw new HttpError('존재하지 않는 상품입니다.', 404);
    }
    return data;
  },

  async createProduct(data: CreateProductDto): Promise<ProductDto> {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        tags: data.tags || [],
        user: {
          connect: { id: data.userId },
        },
      },
    })
  },

  async patchProduct(id: string, data: PatchProductDto): Promise<ProductDto> {
    return await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        tags: data.tags || [],
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        userId: true,
      }
    })
  },

  async deleteProduct(id: string): Promise<boolean> {
    await prisma.product.delete({ where: { id } });
    return true;
  },

  async likeProduct(userId: string, productId: string): Promise<void> {
    try {
      await prisma.productLike.create({
        data: {
          userId,
          productId,
        },
      })
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
        throw new HttpError('이미 좋아요한 상품입니다.', 409);
      }
    }
  },

  async unlikeProduct(userId: string, productId: string): Promise<void> {
    await prisma.productLike.delete({
      where: {
        userId_productId: { userId, productId },
      },
    })
  },

  async getProductWithLike(userId: string, productId: string): Promise<ProductWithLikeDto> {
    const data = await this.getProduct(productId);

    if (!data) {
      throw new HttpError('존재하지 않는 상품입니다.', 404);
    }

    const isLiked = await prisma.productLike.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return {
      ...data,
      isLiked: !!isLiked,
    };
  },

  async getProductLikeUserList(productId: string): Promise<{ userId: string }[]> {
    return await prisma.productLike.findMany({
      where: { productId },
      select: {
        userId: true,
      }
    })
  }
}


export default ProductService;