import { expressjwt } from 'express-jwt';
import { Request } from 'express';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

if (!ACCESS_TOKEN_SECRET) {
  throw new Error('환경 변수 ACCESS_TOKEN_SECRET이 설정되지 않았습니다.');
}
if (!REFRESH_TOKEN_SECRET) {
  throw new Error('환경 변수 REFRESH_TOKEN_SECRET이 설정되지 않았습니다.');
}

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
  getToken: (req: Request) => {
    if (req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  },
  requestProperty: 'user',
});