import prisma from '../prisma/prismaClient.js';

export const createUser = (email: string, nickname: string, hashedPassword: string) =>
  prisma.user.create({
    data: { email, nickname, password: hashedPassword }
  });

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const findUserByNickname = (nickname: string) =>
  prisma.user.findUnique({ where: { nickname } });

export const saveRefreshToken = (userId: number, token: string) =>
  prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token }
  });

export const getUserByRefreshToken = (token: string) =>
  prisma.user.findFirst({ where: { refreshToken: token } });

export const clearRefreshToken = (userId: number) =>
  prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  });