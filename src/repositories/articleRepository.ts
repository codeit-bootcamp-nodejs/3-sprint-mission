import prisma from '../prisma/prismaClient.js';
import type { CreateArticleDto, UpdateArticleDto } from '../types/article.js';

export const findMany = (offset = 0, limit = 10, search = '') =>
  prisma.article.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

export const findById = (id: number) =>
  prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      userId: true,
    },
  });

export const create = (data: CreateArticleDto) =>
  prisma.article.create({
    data: {
      title: data.title,
      content: data.content,
      userId: data.userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

export const update = (id: number, data: UpdateArticleDto) =>
  prisma.article.update({
    where: { id },
    data,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

export const remove = (id: number) =>
  prisma.article.delete({ where: { id } });