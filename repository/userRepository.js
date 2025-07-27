import prisma from '../config/prisma.js';

const findByEmail = (email) => {
  return prisma.user.findUnique({
    where: {
      email: email
    }
  })
}

const save = (user) => {
  return prisma.user.create({
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

export default {
  findByEmail,
  save,
  filterSensitiveUserData,
}