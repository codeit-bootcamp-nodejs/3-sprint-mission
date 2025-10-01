import prisma from '../prisma/prismaClient.js';

export const createForProduct = (productId: number, userId: number, content: string) =>
  prisma.comment.create({
    data: {
      content,
      userId,
      productId,
    },
    select: {
      id: true,
      articleId: true,
      productId: true,
      userId: true,
      content: true,
      createdAt: true,
    },
  });

export const createForArticle = (articleId: number, userId: number, content: string) =>
  prisma.comment.create({
    data: {
      content,
      userId,
      articleId,
    },
    select: {
      id: true,
      articleId: true,
      productId: true,
      userId: true,
      content: true,
      createdAt: true,
    },
  });

export const findForProduct = (productId: number, cursor?: number, limit = 10) =>
  prisma.comment.findMany({
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

export const findForArticle = (articleId: number, cursor?: number, limit = 10) =>
  prisma.comment.findMany({
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

export const findById = (id: number) =>
  prisma.comment.findUnique({ where: { id } });

export const update = (id: number, content: string) =>
  prisma.comment.update({
    where: { id },
    data: { content },
  });

export const remove = (id: number) =>
  prisma.comment.delete({ where: { id } });
