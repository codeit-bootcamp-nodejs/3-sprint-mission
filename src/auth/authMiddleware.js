import { verifyAccessToken } from './tokenUtils.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: '로그인이 필요합니다.' });

  try {
const decoded = verifyAccessToken(token);
  if (!decoded) return res.status(403).json({ message: '토큰이 만료되었거나 유효하지 않습니다.' });

  req.user = { id: decoded.id };
  next();
  } catch (err) {
    console.error('❌ Auth Middleware Error', err.message);
    return res.status(403).json({ message: '토큰 검증 중 오류가 발생했습니다.' });
  }
}