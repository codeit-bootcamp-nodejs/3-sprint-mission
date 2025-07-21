import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/queryHelpers.js';
import hashUtils from '../utils/hash.js';

// 토큰 생성 유틸리티 함수
export const createToken = (user, type) => {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};


export const createUser = async (username, email, password, address, imageUrl) => {
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
        throw new PrismaClientKnownRequestError('이미 사용 중인 사용자 이름입니다.', {
          code: 'P2002'
        });
      }
      if (existingUser.email === email) {
        throw new PrismaClientKnownRequestError('이미 사용 중인 이메일입니다.', {
          code: 'P2002'
        });
      }
    }

    const hashedPassword = await hashUtils.hashingPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        address,
        imageUrl,
      },
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

    return newUser;
  } catch (error) {
    console.error("Error in createUser service:", error);
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

export const findUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        imageUrl: true,
        refreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new PrismaClientKnownRequestError('사용자를 찾을 수 없습니다.', {
        code: 'P2025',
        clientVersion: process.env.PRISMA_CLIENT_VERSION || 'unknown',
        meta: { modelName: 'User', cause: 'record not found' }
      });
    }
    return user;
  } catch (error) {
    console.error("Error in findUserById service:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!user) {
    throw new Error('이메일 또는 비밀번호를 확인해주세요.');
  }

  const isPasswordValid = await hashUtils.verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호를 확인해주세요.');
  }

  // 엑세스 토큰과 리프레시 토큰 생성
  const accessToken = createToken(user, 'access');
  const refreshToken = createToken(user, 'refresh'); // 이 값이 쿠키와 DB에 저장될 값입니다.

  console.log('--- DEBUG: loginUser refresh token ---');
  console.log('1. Generated refreshToken (in service, for cookie):', refreshToken); // 생성된 리프레시 토큰 값 확인
  console.log('2. User ID for update (in service):', user.id); // 업데이트할 사용자 ID 확인

  try {
    // 생성된 refresh token을 사용자 모델에 저장 (업데이트)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshToken } // 이 'refreshToken' 변수의 값을 DB에 저장 시도
    });
    console.log('3. DB update successful. updatedUser.refreshToken (from DB after update):', updatedUser.refreshToken); // DB 업데이트 후 Prisma가 반환한 refreshToken 값 확인
  } catch (dbError) {
    console.error('ERROR: Failed to update refreshToken in DB:', dbError); // DB 업데이트 실패 시 에러 메시지 확인
    // 여기에서 실제 데이터베이스 오류가 발생할 경우를 대비하여 throw하거나 적절히 처리할 수 있습니다.
    // 하지만 현재는 이 에러가 발생하지 않는 상황으로 보입니다.
  }

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

export const updateUser = async (id, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await hashUtils.hashingPassword(updateData.password);
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
        imageUrl: true,
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