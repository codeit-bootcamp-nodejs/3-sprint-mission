import jwt from 'jsonwebtoken';
import type { DecodedToken } from '../types/auth.js';
import { CustomError } from '../utils/CustomError.js';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) throw new Error('❌ Invalid ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET');

export const generateAccessToken = (user: { id: number }): string => {
  try {
    return jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: '1h' });
  } catch (err) {
    throw new CustomError('Access token generation failed', 500);
  }
};

export const verifyAccessToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as DecodedToken;
  } catch {
    throw new CustomError('토큰이 만료되었거나 유효하지 않습니다.', 403);
  }
};

export const generateRefreshToken = (user: { id: number }): string => {
  try {
    return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
  } catch (err) {
    throw new CustomError('Refresh token generation failed', 500);
  }
};

export const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as DecodedToken;
  } catch {
    throw new CustomError('Refresh token invalid', 403);
  }
};