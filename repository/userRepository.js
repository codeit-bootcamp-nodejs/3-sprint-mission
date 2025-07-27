import prisma from '../config/prisma.js';

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email
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

const filterSensitiveUserData = (user) => {
  const { password, ...insensitiveData } = user
  return insensitiveData
}

const getUserProfile = async (userId) => {
  return await prisma.user.findMany({
    where: {
      id: userId
    },
    select: {
      email,
      nickname,
      image,
      createdAt,
      updatedAt,
    }
  })
}

export default {
  findByEmail,
  save,
  getUserProfile,
  filterSensitiveUserData,
}