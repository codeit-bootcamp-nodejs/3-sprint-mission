import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (email, nickname, password) => {
  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { email, nickname, password: hashed }
  });
};

export const findUserByEmail = async (email) =>
  prisma.user.findUnique({ where: { email } });

export const findUserByNickname = async (nickname) =>
  prisma.user.findUnique({ where: { nickname } });

export const verifyPassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export const saveRefreshToken = async (userId, token) =>
  prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token }
  });

export const getUserByRefreshToken = async (token) =>
  prisma.user.findFirst({ where: { refreshToken: token } });

export const clearRefreshToken = async (userId) =>
  prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  });