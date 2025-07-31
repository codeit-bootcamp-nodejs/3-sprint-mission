import prisma from '../config/prisma.js';

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email
    }
  })
}

const findById = async (id) => {
  if (!id) {
    throw new Error('findById 호출 시 id를 입력해야 합니다.')
  }
  return await prisma.user.findUnique({
    where: {
      id: id
    }
  })
}

const save = async (user) => {
  return await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })
}

const getUserProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    }
  })
}

export default {
  findByEmail,
  findById,
  save,
  getUserProfile,
}