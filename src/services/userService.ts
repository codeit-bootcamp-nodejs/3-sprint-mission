import { Prisma } from '@prisma/client';
import hash from '../utils/hash';
import {
  findFirstUserRp,
  createUserRp,
  findUserByEmailRp,
  updateUserTokenRp,
  findUserProfileByIdRp,
  findUserTokenByIdRp,
  updateUserProfileRp,
  deleteUserRp,
} from '../repositories/userRepository'
import { createToken } from '../utils/jwt';
import { CreateUserData, UpdateUserProfileData } from '../../types/user';

// 토큰 생성 유틸리티 함수

export const createUser = async (userData: CreateUserData) => {
  const { username, email, password, address, imageUrl } = userData;
  const existingUser = await findFirstUserRp(username, email)

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
  const newUser = await createUserRp({
    username,
    email,
    password: hashedPassword,
    imageUrl,
    address,
  });
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmailRp(email);
  if (!user) {
    throw new Error('이메일 또는 비밀번호를 확인해주세요.');
  }

  const isPasswordValid = await hash.verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호를 확인해주세요.');
  }

  const accessToken = createToken(user, 'access');
  const refreshToken = createToken(user, 'refresh');
  await updateUserTokenRp(user.id, { refreshToken: refreshToken });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      address: user.address,
      imageUrl: user.imageUrl,
    },
  };
};

export const logoutUser = async (userId: string) => {
  const updatedUser = await updateUserTokenRp(userId, { refreshToken: null });

  if (!updatedUser) {
    throw new Error('로그아웃할 사용자를 찾을 수 없습니다.');
  }

  return { message: '로그아웃 성공', userId: updatedUser.id };
};

export const refreshUserToken = async (userId: string, oldRefreshToken: string) => {
  const user = await findUserTokenByIdRp(userId);

  if (!user || user.refreshToken !== oldRefreshToken) {
    if (user) {
      await updateUserTokenRp(user.id, { refreshToken: null });
    }
    throw new Error('유효하지 않거나 이미 사용된 토큰입니다.');
  }

  const newAccessToken = createToken(user, 'access');
  const newRefreshToken = createToken(user, 'refresh');

  await updateUserTokenRp(user.id, { refreshToken: newRefreshToken });

  return { newAccessToken, newRefreshToken };
};

export const getMyProfile = async (userId: string) => {
  const userProfile = await findUserProfileByIdRp(userId);
  if (!userProfile) {
    throw new Error('사용자 프로필을 찾을 수 없습니다.');
  }
  return userProfile;
};

export const updateUser = async (id: string, updateData: UpdateUserProfileData) => {
  if (updateData.password) {
    updateData.password = await hash.hashingPassword(updateData.password);
  }
  const updatedUser = await updateUserProfileRp(id, updateData);
  return updatedUser;
};

export const deleteMyProfile = async (userId: string) => {
  const deletedUser = await deleteUserRp(userId);
  return deletedUser;
};