// src/services/users.service.js

import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const createUser = async (username, email, address) => {
  try {
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        address,
      },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in createUser service:", error);
    throw error;
  }
};

export const findAllUsers = async () => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error in findAllUsers service:", error);
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new PrismaClientKnownRequestError('사용자를 찾을 수 없습니다.', {
        code: 'P2025',
        meta: { modelName: 'User', cause: 'record not found' },
      });
    }
    return user;
  } catch (error) {
    console.error("Error in findUserById service:", error);
    throw error;
  }
};

export const updateUser = async (id, updateData) => {
  try {
    const updatedUser = await prisma.users.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error in updateUser service:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const deletedUser = await prisma.users.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return deletedUser;
  } catch (error) {
    console.error("Error in deleteUser service:", error);
    throw error;
  }
};