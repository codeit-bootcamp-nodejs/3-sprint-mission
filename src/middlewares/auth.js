import { expressjwt } from 'express-jwt';

// JWT 비밀 키 (환경 변수에서 불러오는 것을 강력히 권장합니다!)
const JWT_SECRET = process.env.JWT_SECRET;

// Access Token 검증 미들웨어
export const verifyAccessToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'user', // 토큰 페이로드를 req.user에 저장
});

// Refresh Token 검증 미들웨어 (쿠키에서 토큰을 가져옴)
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