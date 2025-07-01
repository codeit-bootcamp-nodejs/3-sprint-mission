import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getArticleList = async (offset = 0, limit = 10, search = '') => {
  return await prisma.article.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: {
      createdAt: 'desc',
    },
    skip: Number(offset),
    take: Number(limit),
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  })
}

export const getArticleById = async (id) => {
  return await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  })
}

export const createArticle = async (data) => {
  return await prisma.article.create({
    data,
  });
};

export const updateArticle = async (id, data) => {
  try {
    return await prisma.article.update({
      where: { id },
      data,
    });
  } catch (err) {
    if (err.code === 'P2025') return null;
    throw err;
  }
}

export const deleteArticle = async (id) => {
  try {
    await prisma.article.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    if (err.code === 'P2025') return false;
    throw err;
  }
}