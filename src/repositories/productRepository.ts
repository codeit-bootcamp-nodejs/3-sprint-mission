import prisma, { Prisma } from "../config/prisma";
import { HttpError } from "../types/error";
import { PaginatedResponseDto } from "../types/common";
import {
  CreateProductDto,
  PatchProductDto,
  ProductDto,
  SimpleProductDto,
  ProductWithLikeDto,
} from "../types/product";

const getUserRegisteredProducts = async (
  userId: string
): Promise<ProductDto[]> => {
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
      },
    });
  } catch (error) {
    throw new HttpError(
      "사용자가 등록한 상품 조회 중 오류가 발생했습니다.",
      500
    );
  }
};

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
      },
    });
  } catch (error) {
    throw new HttpError(
      "사용자가 좋아요한 상품 조회 중 오류가 발생했습니다.",
      500
    );
  }
};

const getProductList = async (
  offset: number = 0,
  limit: number = 10,
  orderBy: "asc" | "desc" = "desc",
  keyword: string = ""
): Promise<PaginatedResponseDto<SimpleProductDto>> => {
  let where: any = {};
  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
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
    },
  });
  const total = await prisma.product.count({
    where,
  });
  const pages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      pages,
      offset,
      limit,
    },
  };
};

const getProduct = async (id: string): Promise<ProductDto> => {
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
    },
  });
  if (!data) {
    throw new HttpError("존재하지 않는 상품입니다.", 404);
  }
  return data;
};

const createProduct = async (data: CreateProductDto): Promise<ProductDto> => {
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
  });
};
const patchProduct = async (
  id: string,
  data: PatchProductDto
): Promise<ProductDto> => {
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
    },
  });
};

const deleteProduct = async (id: string): Promise<boolean> => {
  await prisma.product.delete({ where: { id } });
  return true;
};

const likeProduct = async (
  userId: string,
  productId: string
): Promise<void> => {
  try {
    await prisma.productLike.create({
      data: {
        userId,
        productId,
      },
    });
  } catch (error) {
    if ((error as Prisma.PrismaClientKnownRequestError).code === "P2002") {
      throw new HttpError("이미 좋아요한 상품입니다.", 409);
    }
  }
};

const unlikeProduct = async (
  userId: string,
  productId: string
): Promise<void> => {
  await prisma.productLike.delete({
    where: {
      userId_productId: { userId, productId },
    },
  });
};

const getProductWithLike = async (
  userId: string,
  productId: string
): Promise<ProductWithLikeDto> => {
  const data = await getProduct(productId);

  if (!data) {
    throw new HttpError("존재하지 않는 상품입니다.", 404);
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
};

const getProductLikeUserList = async (
  productId: string
): Promise<{ userId: string }[]> => {
  return await prisma.productLike.findMany({
    where: { productId },
    select: {
      userId: true,
    },
  });
};

export default {
  getUserRegisteredProducts,
  getUserLikedProducts,
  getProduct,
  createProduct,
  getProductList,
  patchProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
  getProductWithLike,
  getProductLikeUserList,
};
