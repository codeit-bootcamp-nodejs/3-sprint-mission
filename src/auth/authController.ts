import type { RequestHandler } from 'express';
import { CustomError } from '../utils/CustomError.js';
import {
  createUser,
  findUserByEmail,
  findUserByNickname,
  verifyPassword,
  saveRefreshToken,
  getUserByRefreshToken,
  clearRefreshToken
} from './authService.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from './tokenUtils.js';
import type { SignupDto, LoginDto, RefreshDto } from '../types/auth.js';

/**
 * @function signup
 * 
 * @description
 * 사용자가 회원가입할 수 있도록 계정을 생성합니다.
 * 이메일과 닉네임 중복 검사를 수행하며, 성공 시 새로운 사용자 정보를 반환합니다.
 * 
 * @param {Object} req - Express 요청 객체 (SignupDto)
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {201} 사용자 생성 성공 (id, email, nickname 반환)
 * @throws {409} 이메일 또는 닉네임 중복
 */
export const signup: RequestHandler = async (req, res) => {
  const { email, nickname, password } = req.body as SignupDto;

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new CustomError('이미 등록된 이메일입니다.', 409);

  const existingNickname = await findUserByNickname(nickname);
  if (existingNickname) throw new CustomError('이미 사용 중인 닉네임입니다.', 409);

  const user = await createUser(email, nickname, password);
  res.status(201).json({ id: user.id, email: user.email, nickname: user.nickname });
};

/**
 * @function login
 * 
 * @description
 * 사용자가 이메일과 비밀번호로 로그인합니다.
 * 로그인 성공 시 Access Token과 Refresh Token을 발급합니다.
 * 
 * @param {Object} req - Express 요청 객체 (LoginDto) 
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 로그인 성공 (accessToken, refreshToken 반환)
 * @throws {401} 이메일 또는 비밀번호 불일치 
 */
export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as LoginDto;

  const user = await findUserByEmail(email);
  const isValid = user && (await verifyPassword(password, user.password));
  if (!isValid) throw new CustomError('이메일 또는 비밀번호가 올바르지 않습니다.', 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await saveRefreshToken(user.id, refreshToken);

  res.status(200).json({ accessToken, refreshToken });
};

/**
 * @function refresh
 * 
 * @description
 * Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급합니다.
 * 미션 요구사항 외에 Sliding Session을 추가로 적용하여, Refresh Token을 재사용하지 않고 새로 발급합니다.
 * 
 * @param {Object} req - Express 요청 객체 (RefreshDto)
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 새 Access Token과 Refresh Token을 JSON 형식으로 반환
 * @throws {401} Refresh Token 누락
 * @throws {403} Refresh Token 만료 또는 위조
*/
export const refresh: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body as RefreshDto;
  if (!refreshToken) throw new CustomError('RefreshToken이 필요합니다.', 401);

  verifyRefreshToken(refreshToken);

  const user = await getUserByRefreshToken(refreshToken);
  if (!user) throw new CustomError('토큰이 만료되었거나 유효하지 않습니다.', 403);

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await saveRefreshToken(user.id, newRefreshToken);
  res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

/**
 * @function logout
 *
 * @description
 * 로그인된 사용자의 Refresh Token을 삭제하여 세션을 종료합니다.
 * 미션 요구사항에는 명시되지 않았지만, Refresh Token 기반 인증에서 보안을 위해 필요한 확장 기능입니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 로그아웃 성공
 * @throws {401} 인증 정보 없음
 */
export const logout: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new CustomError('로그인이 필요합니다.', 401);

  await clearRefreshToken(userId);
  res.status(200).json({ message: '로그아웃 되었습니다.' });
};