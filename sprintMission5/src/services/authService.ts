import { z } from "zod";
import jwt from "jsonwebtoken";
import {
  loginTokenDto,
  UserEmailDto
} from "../types/auth";
import { HttpError } from "../types/error";
import userRepository from "../repositories/userRepository"
import { hashPassword, isPasswordValid } from "../utils/passwordUtil";
import { checkUser } from "../utils/checkUser";
/**
 * 이메일,패스워드를 받아 로그인을 수행하고 액세스토큰 및 리프레시 토큰을 반환합니다.
 * @param email 
 * @param password 
 * @returns { accessToken: string; refreshToken: string; }
 * 
 * @throws {HttpError} 존재하지 않는 유저이거나 비밀번호가 일치하지 않는 경우 (status 404, 401)
 * @throws {HttpError} 이메일 형식이 유효하지 않은 경우 (status 400)
 */

const login = async (email: string, password: string): Promise<loginTokenDto> => {
  const user = await userRepository.findbyEmail(email);
  if (!user) {
    throw new HttpError('존재하지 않는 유저입니다.', 404);
  }
  const isValidPassword = await isPasswordValid(password, user.password);
  if (!isValidPassword) {
    throw new HttpError('사용자 정보가 일치하지 않습니다.', 401);
  }
  const accessToken = createToken(user, 'access');
  const refreshToken = createToken(user, 'refresh');
  await userRepository.updateUser(user.id, { refreshToken });
  return { accessToken, refreshToken };
}

/**
 * 유저 아이디와 새 비밀번호, 기존 비밀번호를 받아 비밀번호를 변경합니다.
 * @param userId 
 * @param newPassword 
 * @param oldPassword 
 * @returns {boolean} - 성공 시 true
 * 
 * @throws {HttpError} 사용자 정보가 일치하지 않거나 새 비밀번호가 유효하지 않은 경우 (status 401)
 * @throws {HttpError} 비밀번호 해싱 중 오류가 발생한 경우 (status 500)
 * @throws {HttpError} 새 비밀번호는 8자 이상 20자 이하로 입력해야 합니다. (status 400)
 * @throws {HttpError} 유저 아이디가 없거나 존재하지 않는 유저 경우 (status 401, 404)
 */

const changePassword = async (newPassword: string, oldPassword: string, userId?: string): Promise<boolean> => {
  const user = await checkUser(userId);
  const isValidPassword = await isPasswordValid(oldPassword, user.password);
  if (!isValidPassword) {
    throw new HttpError('사용자 정보가 일치하지 않습니다.', 401);
  }
  const passwordSchema = z.string().min(8).max(20);
  const passwordValidation = passwordSchema.safeParse(newPassword);
  if (!passwordValidation.success) {
    throw new HttpError("새 비밀번호는 8자 이상 20자 이하로 입력해야 합니다.", 400);
  }
  const hashedNewPassword = await hashPassword(newPassword);
  await userRepository.updateUser(user.id, { password: hashedNewPassword });
  return true;
}

const createToken = (user: UserEmailDto, type = 'access'): string => {
  const payLoad = { userId: user.id }
  const jwtSecret = (type === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET)!;
  const expiresIn = type === 'access' ? '1h' : '2w';
  const token = jwt.sign(payLoad, jwtSecret, { expiresIn });
  return token;
}

const tokenRefresh = async (refreshToken: string, userId?: string,): Promise<string> => {
  const user = await checkUser(userId);
  if (user.refreshToken !== refreshToken) {
    throw new HttpError('유효하지 않은 리프레시 토큰입니다.', 401);
  }
  return createToken(user, 'access');
}

export default {
  login,
  changePassword,
  tokenRefresh,
}