import { createUser, findUserByEmail, verifyPassword, saveRefreshToken, getUserByRefreshToken, clearRefreshToken } from './authService.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './tokenUtils.js';

export const signup = async (req, res) => {
  const { email, nickname, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.status(409).json({ message: '이미 등록된 이메일입니다' });

  const existingNickname = await findUserByNickname(nickname);
  if (existingNickname) return res.status(409).json({ message: '이미 사용 중인 닉네임입니다' });

  const user = await createUser(email, nickname, password);
  return res.status(201).json({ id: user.id, email: user.email, nickname: user.nickname });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  const isValid = user && await verifyPassword(password, user.password);
  if (!isValid) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await saveRefreshToken(user.id, refreshToken);

  return res.status(200).json({ accessToken, refreshToken });
};

/**
 * @function refresh
 * 
 * @description
 * 
 * Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급합니다.
 * 미션 요구사항 외에 Sliding Session을 추가로 적용하여, Refresh Token을 재사용하지 않고 새로 발급합니다.
 * 
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * 
 * @returns {200} 새 Access Token과 Refresh Token을 JSON 형식으로 반환
 * @returns {401} Refresh Token 누락
 * @returns {403} Refresh Token 만료 또는 위조
*/
export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'RefreshToken이 필요합니다.'});

  const decoded = verifyRefreshToken(refreshToken);
  const user = decoded && await getUserByRefreshToken(refreshToken);
  if (!user) return res.status(403).json({ message: '토큰이 만료되었거나 유효하지 않습니다.' });

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  await saveRefreshToken(user.id, newRefreshToken);
  return res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

/**
 * @function logout
 *
 * @description
 * 로그인된 사용자의 Refresh Token을 삭제하여 세션을 종료합니다.
 * 미션 요구사항에는 명시되지 않았지만, Refresh Token 기반 인증에서 보안을 위해 필요한 확장 기능입니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 로그아웃 성공
 * @returns {401} 인증 정보 없음
 */
export const logout = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: '로그인이 필요합니다' });

  await clearRefreshToken(userId);
  res.status(200).json({ message: '로그아웃 되었습니다.' });
};