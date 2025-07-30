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

/**
 * @function getMyInfo
 * @description
 * 로그인한 사용자의 정보를 조회합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 사용자 정보 반환
 * @throws {404} 사용자를 찾을 수 없는 경우
 */
export const getMyInfo: RequestHandler = async (req, res) => {
  const user = await getUserById(req.user.id);
  res.status(200).json(user);
};

/**
 * @function patchMyInfo
 * @description
 * 사용자의 프로필 정보를 수정합니다.
 * nickname과 image는 optional 필드이며, 전달된 값만 업데이트합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 수정된 사용자 정보 반환
 * @throws {400} 수정할 정보가 없는 경우
 * @throws {404} 사용자를 찾을 수 없는 경우
 */
export const patchMyInfo: RequestHandler = async (req, res) => {
  const dto: UpdateUserInfoDto = req.body;
  const updated = await updateUserInfo(req.user.id, dto);
  res.status(200).json(updated);
};

/**
 * @function patchMyPassword
 * @description
 * 로그인한 사용자의 비밀번호를 변경합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 비밀번호 변경 완료 메시지
 * @throws {400} 비밀번호 입력값이 없거나 유효하지 않은 경우
 * @throws {403} 현재 비밀번호가 틀린 경우
 * @throws {404} 사용자를 찾을 수 없는 경우
 */
export const patchMyPassword: RequestHandler = async (req, res) => {
  const dto: UpdateUserPasswordDto = req.body;
  await updateUserPassword(req.user.id, dto.currentPassword, dto.newPassword);
  res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
};

/**
 * @function getMyProducts
 * @description
 * 로그인한 사용자가 등록한 상품 목록을 조회합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 상품 목록 반환
 */
export const getMyProducts: RequestHandler = async (req, res) => {
  const products = await getUserProducts(req.user.id);
  res.status(200).json(products);
};