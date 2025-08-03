import prisma from '../config/prisma';
import { HttpError } from '../types/error';
import { ProductDto } from '../types/product';

const getUserRegisteredProducts = async (userId: string): Promise<ProductDto[]> => {
  try {
    return await prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        userId: true,
      }
    });
  } catch (error) {
    throw new HttpError('사용자가 등록한 상품 조회 중 오류가 발생했습니다.', 500);
  }
}

const getUserLikedProducts = async (userId: string): Promise<ProductDto[]> => {
  try {
    return await prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId,
          },
        },
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
    });
  } catch (error) {
    throw new HttpError('사용자가 좋아요한 상품 조회 중 오류가 발생했습니다.', 500);
  }
}

export default {
  getUserRegisteredProducts,
  getUserLikedProducts,
}