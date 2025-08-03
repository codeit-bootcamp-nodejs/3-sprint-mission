import bcrypt from 'bcrypt';
import { HttpError } from '../types/error';
const SALT_ROUNDS = 10;

/**
 * 주어진 평문 비밀번호를 bcrypt로 해싱해서 반환합니다.
 * @param {string} plainPassword
 * @returns {Promise<string|false>} - 실패 시 false
 * 
 * @throws {Error} 비밀번호 해싱 중 오류가 발생한 경우 (status 500)
 */
const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    throw new HttpError('비밀번호 해싱 중 오류', 500);
  }
};

/**
 * 평문 비밀번호와 해시가 일치하는지 확인합니다.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>} - 실패 시 false
 * 
 * @throws {Error} 비밀번호 비교 중 오류가 발생한 경우 (status 500)
 */
const isPasswordValid = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new HttpError('비밀번호 비교 중 오류', 500);
  }
};

export { hashPassword, isPasswordValid };