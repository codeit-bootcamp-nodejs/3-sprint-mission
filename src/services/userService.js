import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserById = async (id) =>
  prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true
    }
  });

export const updateUserInfo = async (id, { nickname, image }) => {
  const data = {};
  if (nickname !== undefined) data.nickname = nickname;
  if (image !== undefined) data.image = image;

  return prisma.user.update({
    where: { id },
    data: { nickname, image },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true
    }
  });
};

export const updateUserPassword = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: { id },
    data: { password: hashed },
    select: {
      id: true
    }
  });
};

export const getUserProducts = async (userId) =>
  prisma.product.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });