import { expressjwt } from 'express-jwt';

const JWT_SECRET = process.env.JWT_SECRET;

// Access Token 검증 미들웨어
export const verifyAccessToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

// Refresh Token 검증 미들웨어
export const verifyRefreshToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  },
  requestProperty: 'user',
});