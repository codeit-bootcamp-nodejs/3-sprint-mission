import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getPaginationParams, getSearchParams, getSortParams } from '../utils/queryHelpers.js';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}



export const findAllProducts = async ({ offset, limit, sort, search }) => {
  const { skip, take } = getPaginationParams({ offset, limit });
  const orderBy = getSortParams({ sort }, 'createdAt');
  const where = getSearchParams(search, ['name', 'description']);

  try {
    const products = await prisma.products.findMany({
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

export const createProduct = async ({ name, description, price, isSold, tags, stock, usersId }) => {
  try {
    const product = await prisma.products.create({
      data: {
        name,
        description,
        price,
        isSold,
        tags,
        stock,
        user: {
          connect: {
            id: usersId
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
    const product = await prisma.products.findUnique({
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

export const updateProduct = async (productId, updateData) => {
  try {
    const updatedProduct = await prisma.products.update({
      where: { id: productId },
      data: updateData,
    });
    return updatedProduct;

  } catch (error) {
    console.error("Error in updateProduct service:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await prisma.products.delete({
      where: { id: productId }
    });
    return deletedProduct;

  } catch (error) {
    console.error("Error in deleteProduct service:", error);
    throw error;
  }
};