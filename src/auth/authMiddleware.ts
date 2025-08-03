import type { RequestHandler } from 'express';
import { verifyAccessToken } from './tokenUtils.js';
import { CustomError } from '../utils/CustomError.js';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) throw new CustomError('로그인이 필요합니다.', 401);

  const decoded = verifyAccessToken(token);

  req.user = { id: decoded.id };

  next();
};