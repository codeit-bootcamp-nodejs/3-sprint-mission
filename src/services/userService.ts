import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import hash from '../utils/hash';
import { StringValue } from 'ms';
import { CreateUserData, UpdateUserData } from '../../types/user'

// 토큰 생성 유틸리티 함수
export const createToken = (user: { id: string }, type: 'access' | 'refresh') => {
  const payload = { userId: user.id };
  let secret;
  let expiresIn: StringValue;

  if (type === 'access') {
    secret = process.env.ACCESS_TOKEN_SECRET as string;
    expiresIn = '1h'; // 1h
  } else if (type === 'refresh') {
    secret = process.env.REFRESH_TOKEN_SECRET as string;
    expiresIn = '2w'; // 2w
  } else {
    throw new Error('유효하지 않은 토큰 타입입니다.');
  }
  const options = {
    expiresIn: expiresIn,
  };
  return jwt.sign(payload, secret, options);
};


export const createUser = async (userData: CreateUserData) => {
  const { username, email, password, address, imageUrl } = userData;
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Prisma.PrismaClientKnownRequestError('이미 사용 중인 사용자 이름입니다.', {
          code: 'P2002',
          clientVersion: '5.22.0',
        });
      }

      if (existingUser.email === email) {
        throw new Prisma.PrismaClientKnownRequestError('이미 사용 중인 이메일입니다.', {
          code: 'P2002',
          clientVersion: '5.22.0',
        });
      }
    }
    const hashedPassword = await hash.hashingPassword(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        imageUrl,
        address,
      },
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

    return newUser;
  } catch (error) {
    throw error;
  }
};

// export const findAllUsers = async () => {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         address: true,
//         imageUrl: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });
//     return users;
//   } catch (error) {
//     console.error("Error in findAllUsers service:", error);
//     throw error;
//   }
// };

export const findUserById = async <T extends Prisma.UserSelect>(
  id: string,
  selectOptions: T
): Promise<Prisma.UserGetPayload<{ select: T }> | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: selectOptions,
  });

  if (!user) {
    throw new Prisma.PrismaClientKnownRequestError('사용자를 찾을 수 없습니다.', {
      code: 'P2025',
      meta: { modelName: 'User', cause: 'record not found' },
      clientVersion: '5.22.0',
    });
  }
  return user as Prisma.UserGetPayload<{ select: T }>;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!user) {
    throw new Error('이메일 또는 비밀번호를 확인해주세요.');
  }
  const isPasswordValid = await hash.verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호를 확인해주세요.');
  }
  // 엑세스 토큰과 리프레시 토큰 생성
  const accessToken = createToken(user, 'access');
  const refreshToken = createToken(user, 'refresh');
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: refreshToken }
  });
  return {
    accessToken: accessToken,
    refreshToken: refreshToken, // 이 refreshToken이 라우터로 반환되어 쿠키에 설정됩니다.
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      address: user.address,
      imageUrl: user.imageUrl,
    }
  };
};

export const logoutUser = async (userId: string) => {
  try {
    // 해당 사용자의 refreshToken 필드를 null로 업데이트하여 무효화
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
      select: { id: true, username: true }
    });

    if (!updatedUser) {
      // 사용자를 찾을 수 없거나 업데이트에 실패한 경우
      throw new Prisma.PrismaClientKnownRequestError('로그아웃할 사용자를 찾을 수 없습니다.', {
        code: 'P2025',
        meta: { modelName: 'User', cause: 'user not found for logout' },
        clientVersion: '5.22.0',
      });
    }
    return { message: '로그아웃 성공', userId: updatedUser.id };

  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: string, updateData: UpdateUserData) => {
  try {
    if (updateData.password) {
      updateData.password = await hash.hashingPassword(updateData.password);
    }

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
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const deletedUser = await prisma.user.delete({
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
    return deletedUser;
  } catch (error) {
    throw error;
  }
};