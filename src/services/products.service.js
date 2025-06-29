
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  getPaginationParams,
  getSearchParams,
  getSortParams,
  prisma,
  checkProductOwnership
} from '../utils/queryHelpers.js';

export const findAllProducts = async ({ offset, limit, sort, search }) => {
  const { skip, take } = getPaginationParams({ offset, limit });
  const orderBy = getSortParams({ sort }, 'createdAt');
  const where = getSearchParams(search, ['name', 'description']);

  try {
    const products = await prisma.product.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return products;
  } catch (error) {
    console.error("Error in findAllProducts:", error);
    throw error;
  }
};

export const createProduct = async ({ name, description, price, isSold, tags, stock, userId, imageUrl }) => {
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        isSold,
        tags,
        stock,
        imageUrl,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    return product;
  } catch (error) {
    console.error("Error in createProduct service:", error);
    throw error;
  }
};

export const findProductById = async (productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isSold: true,
        tags: true,
        stock: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!product) {
      throw new PrismaClientKnownRequestError('상품을 찾을 수 없습니다.', {
        code: 'P2025',
        meta: { modelName: 'Product', cause: 'record not found' },
      });
    }

    return product;
  } catch (error) {
    console.error("Error in findProductById:", error);
    throw error;
  }
};

export const updateProduct = async (productId, userId, updateData) => {
  try {
    await checkProductOwnership(productId, userId);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isSold: true,
        tags: true,
        stock: true,
        imageUrl: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true
          }
        }
      },
    });
    return updatedProduct;

  } catch (error) {
    console.error("Error in updateProduct service:", error);
    throw error;
  }
};

export const deleteProduct = async (productId, userId) => {
  try {
    await checkProductOwnership(productId, userId);

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isSold: true,
        tags: true,
        stock: true,
        imageUrl: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return deletedProduct;

  } catch (error) {
    console.error("Error in deleteProduct service:", error);
    throw error;
  }
};