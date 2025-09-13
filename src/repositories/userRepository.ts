import prisma from '../prisma/prismaClient.js';
import { UpdateUserInfoDto } from '../types/user.js';

export const findById = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const updateInfo = (id: number, data: UpdateUserInfoDto) =>
  prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const findPassword = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });

export const updatePassword = (id: number, hashedPassword: string) =>
  prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

export const findProductsByUser = (userId: number) =>
  prisma.product.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });