import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProductComment = async (productId, userId, content) => {
  return await prisma.comment.create({
    data: {
      content,
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
    },
  });
};

export const getProductComments = async (productId, { cursor, limit = 10 }) => {
  return await prisma.comment.findMany({
    where: { productId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'asc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
};

export const createArticleComment = async (articleId, userId, content) => {
  return await prisma.comment.create({
    data: {
      content,
      user: { connect: { id: userId } },
      article: { connect: { id: articleId } },
    },
  });
};

export const getArticleComments = async (articleId, { cursor, limit = 10 }) => {
  return await prisma.comment.findMany({
    where: { articleId },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { id: 'asc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });
};

export const updateComment = async (id, userId, content) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || comment.userId !== userId) return null;

  return await prisma.comment.update({
    where: { id },
    data: { content },
  });
};

export const deleteComment = async (id, userId) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || comment.userId !== userId) return false;

  await prisma.comment.delete({ where: { id } });
  return true;
};