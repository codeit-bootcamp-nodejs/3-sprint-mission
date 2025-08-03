import prisma from '../config/prisma';
import { HttpError } from '../types/error';
import { UserEmailDto } from '../types/auth';
import {
  UserDto,
  CreateUserDto,
  PatchUserDto
} from '../types/user';

const findbyEmail = async (email: string): Promise<UserEmailDto | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    return user;
  } catch (error) {
    throw new HttpError('이메일로 사용자 조회 중 오류가 발생했습니다.', 500);
  }
}

const findById = async (id: string): Promise<UserDto | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpError('존재하지 않는 유저입니다.', 404);
    }
    const userDto = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image ?? undefined,
      password: user.password,
      refreshToken: user.refreshToken ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
    return userDto;
  } catch (error) {
    throw new HttpError('유저 조회 중 오류가 발생했습니다.', 500);
  }
}

const createUser = async (user: CreateUserDto): Promise<UserDto> => {
  try {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        nickname: user.nickname,
        password: user.password,
        image: user.image || null, // 이미지가 없을 경우 null로 설정
      },
    });
    return {
      id: createdUser.id,
      email: createdUser.email,
      nickname: createdUser.nickname,
      image: createdUser.image ?? undefined,
      password: createdUser.password,
      refreshToken: createdUser.refreshToken ?? undefined,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  } catch (error) {
    throw new HttpError('사용자 생성 중 오류가 발생했습니다.', 500);
  }
}

const updateUser = async (id: string, data: PatchUserDto): Promise<UserDto> => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      image: updatedUser.image ?? undefined,
      password: updatedUser.password,
      refreshToken: updatedUser.refreshToken ?? undefined,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  } catch (error) {
    throw new HttpError('사용자 업데이트 중 오류가 발생했습니다.', 500);
  }
}

export default {
  findbyEmail,
  createUser,
  updateUser,
  findById,
}