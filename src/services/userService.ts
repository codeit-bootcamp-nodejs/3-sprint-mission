import bcrypt from 'bcrypt';
import { CustomError } from '../utils/CustomError.js';
import { UpdateUserInfoDto, PublicUser, PublicUserProduct } from '../types/user.js';
import {
  findById,
  updateInfo,
  findPassword,
  updatePassword,
  findProductsByUser,
} from '../repositories/userRepository.js';

export const getUserById = async (id: number): Promise<PublicUser> => {
  const user = await findById(id);
  if (!user) throw new CustomError('사용자 정보가 없습니다.', 404);
  return user;
};

export const updateUserInfo = async (id: number, data: UpdateUserInfoDto): Promise<PublicUser> => {
  if (data.nickname === undefined && data.image === undefined) throw new CustomError('수정할 정보를 입력해 주세요.', 400);

  return updateInfo(id, data);
};

export const updateUserPassword = async (
  id: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  if (!currentPassword || !newPassword) throw new CustomError('비밀번호를 모두 입력해 주세요.', 400);

  const user = await findPassword(id);
  if (!user) throw new CustomError('사용자 정보가 없습니다.', 404);

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new CustomError('비밀번호가 올바르지 않습니다.', 403);

  const hashed = await bcrypt.hash(newPassword, 10);
  await updatePassword(id, hashed);
};

export const getUserProducts = async (userId: number): Promise<PublicUserProduct[]> => {
  return findProductsByUser(userId);
};