import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (user) => {
  try {
    return jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: '1h' });
  } catch (err) {
    console.error('❌ Access token generation failed:', err.message);
    return null;
  }
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    console.error('❌ Access token invalid:', err.message);
    return null;
  }
};

export const generateRefreshToken = (user) => {
  try {
    return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
  } catch (err) {
    console.error('❌ Refresh token generation failed:', err.message);
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    console.error('❌ Refresh token invalid:', err.message);
    return null;
  }
};