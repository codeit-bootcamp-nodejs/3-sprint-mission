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
}

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
}

export const createProduct = async (data) => {
  return await prisma.product.create({
    data,
  });
}

export const updateProduct = async (id, data) => {
  try {
    return await prisma.product.update({
      where: { id },
      data,
    });
  } catch (err) {
    if (err.code === 'P2025') return null;
    throw err;
  }
}

export const deleteProduct = async (id) => {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    if (err.code === 'P2025') return false;
    throw err;
  }
}