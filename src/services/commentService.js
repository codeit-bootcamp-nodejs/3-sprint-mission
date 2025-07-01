import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProductComment = async (productId, content) => {
  return await prisma.comment.create({
    data: {
      content,
      product: {
        connect: { id: productId },
      },
    },
  })
}

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
  })
}

export const createArticleComment = async (articleId, content) => {
  return await prisma.comment.create({
    data: {
      content,
      article: {
        connect: { id: articleId },
      },
    },
  })
}

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
  })
}

export const updateComment = async (id, content) => {
  try {
    return await prisma.comment.update({
      where: { id },
      data: { content },
    });
  } catch (err) {
    if (err.code === 'P2025') return null;
    throw err;
  }
}

export const deleteComment = async (id) => {
  try {
    await prisma.comment.delete({
      where: { id },
    });
    return true;
  } catch (err) {
    if (err.code === 'P2025') return false;
    throw err;
  }
}