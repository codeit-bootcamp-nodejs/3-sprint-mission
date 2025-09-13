import bcrypt from 'bcrypt';
import {
  createUser as repoCreateUser,
  findUserByEmail,
  findUserByNickname,
  saveRefreshToken,
  getUserByRefreshToken,
  clearRefreshToken
} from './authRepository.js';

export const createUser = async (email: string, nickname: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return repoCreateUser(email, nickname, hashedPassword);
};

export const verifyPassword = async (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword);

export {
  findUserByEmail,
  findUserByNickname,
  saveRefreshToken,
  getUserByRefreshToken,
  clearRefreshToken
};