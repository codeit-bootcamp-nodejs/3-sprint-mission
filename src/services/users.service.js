
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../utils/queryHelpers.js';

export const createUser = async (username, email, address) => {
  try {
    const newUser = await prisma.user.create({
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
    const users = await prisma.user.findMany({
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
    const user = await prisma.user.findUnique({
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
    const updatedUser = await prisma.user.update({
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
    const deletedUser = await prisma.user.delete({
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