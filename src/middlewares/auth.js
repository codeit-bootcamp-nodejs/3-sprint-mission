import { expressjwt } from 'express-jwt';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
// Access Token 검증 미들웨어
export const verifyAccessToken = expressjwt({
  secret: ACCESS_TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user',
});

// Refresh Token 검증 미들웨어
export const verifyRefreshToken = expressjwt({
  secret: REFRESH_TOKEN_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  },
  requestProperty: 'user',
});