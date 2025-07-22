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
  });
};

export const getArticleById = async (id) => {
  return await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
};

export const createArticle = async ({ userId, ...rest }) => {
  return await prisma.article.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
    },
  });
};

export const updateArticle = async (id, userId, data) => {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article || article.userId !== userId) return null;

  return await prisma.article.update({
    where: { id },
    data,
  });
};

export const deleteArticle = async (id, userId) => {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article || article.userId !== userId) return false;

  await prisma.article.delete({ where: { id } });
  return true;
};