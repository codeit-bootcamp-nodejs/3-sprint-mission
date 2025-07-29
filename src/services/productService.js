import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProductList = async (offset = 0, limit = 10, search = '', sort = 'desc') => {
  return await prisma.product.findMany({
    where: search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
      : {},
    orderBy: {
      createdAt: sort === 'asc' ? 'asc' : 'desc',
    },
    skip: Number(offset),
    take: Number(limit),
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  })
};

export const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  })
};

export const createProduct = async ({ userId, ...rest }) => {
  return await prisma.product.create({
    data: {
      ...rest,
      user: { connect: { id: userId } }
    }
  });
};

export const updateProduct = async (id, userId, data) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.userId !== userId) return null;

  return await prisma.product.update({
    where: { id },
    data,
  });
};

export const deleteProduct = async (id, userId) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.userId !== userId) return false;

  await prisma.product.delete({
    where: { id },
  });
  return true;
};