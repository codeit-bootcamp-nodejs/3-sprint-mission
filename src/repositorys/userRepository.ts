import prisma from '../lib/prisma';
import { CreateUserData, UpdateUserProfileData, UpdateUserTokenData } from '../../types/user';


export const findFirstUserRp = async (username: string, email: string) =>
  await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }]
    }
  });

export const createUserRp = async (userData: CreateUserData) =>
  await prisma.user.create({
    data: userData,
    select: {
      id: true,
      username: true,
      email: true,
      imageUrl: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

export const findUserByEmailRp = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserProfileByIdRp = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      address: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUserProfileRp = async (id: string, updateData: UpdateUserProfileData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      address: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUserTokenRp = async (id: string, updateData: UpdateUserTokenData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
    },
  });
};

export const findUserTokenByIdRp = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      refreshToken: true,
    },
  });
};

export const deleteUserRp = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
};