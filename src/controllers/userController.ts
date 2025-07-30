import type { RequestHandler } from 'express';
import {
  getUserById,
  updateUserInfo,
  updateUserPassword,
  getUserProducts,
} from '../services/userService.js';
import type {
  UpdateUserInfoDto,
  UpdateUserPasswordDto,
} from '../types/user.js';

export const getMyInfo: RequestHandler = async (req, res) => {
  const user = await getUserById(req.user.id);
  res.status(200).json(user);
};

/**
 * @function patchMyInfo
 * nickname과 image는 optional 필드이며, 전달된 값만 업데이트합니다.
 */
export const patchMyInfo: RequestHandler = async (req, res) => {
  const dto: UpdateUserInfoDto = req.body;
  const updated = await updateUserInfo(req.user.id, dto);
  res.status(200).json(updated);
};


export const patchMyPassword: RequestHandler = async (req, res) => {
  const dto: UpdateUserPasswordDto = req.body;
  await updateUserPassword(req.user.id, dto.currentPassword, dto.newPassword);
  res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
};

export const getMyProducts: RequestHandler = async (req, res) => {
  const products = await getUserProducts(req.user.id);
  res.status(200).json(products);
};