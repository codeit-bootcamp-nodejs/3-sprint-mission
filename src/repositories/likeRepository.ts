import prisma from '../prisma/prismaClient.js';
import { LikeTargetType } from '../types/like.js';

const getTarget = (userId: number, targetId: number, type: LikeTargetType) =>
  type === 'product'
    ? { userId, productId: targetId }
    : { userId, articleId: targetId };

export const countLike = (userId: number, targetId: number, type: LikeTargetType) =>
  prisma.like.count({ where: getTarget(userId, targetId, type) });

export const createLike = (userId: number, targetId: number, type: LikeTargetType) =>
  prisma.like.create({ data: getTarget(userId, targetId, type) });

export const deleteLike = (userId: number, targetId: number, type: LikeTargetType) =>
  prisma.like.deleteMany({ where: getTarget(userId, targetId, type) });

export const findUserLikedProducts = (userId: number) =>
  prisma.product.findMany({
    where: {
      likes: { some: { userId } },
    },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

export const findUserLikedArticles = (userId: number) =>
  prisma.article.findMany({
    where: {
      likes: { some: { userId } },
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  export const findUsersByProduct = (productId: number) =>
  prisma.like.findMany({ where: { productId }, select: { userId: true } });
  