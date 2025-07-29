import bcrypt from 'bcrypt';
import { getUserById, updateUserInfo, updateUserPassword, getUserProducts } from '../services/userService.js';

export const getMyInfo = async (req, res) => {
  const user = await getUserById(req.user.id);
  return res.status(200).json(user);
};

/**
 * nickname과 image는 optional 필드이며,
 * 전달된 값만 업데이트합니다.
 */
export const patchMyInfo = async (req, res) => {
  const { nickname, image } = req.body;
  const updated = await updateUserInfo(req.user.id, { nickname, image });
  return res.status(200).json(updated);
};

export const patchMyPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: '비밀번호를 모두 입력해 주세요.' });

  const user = await getUserById(req.user.id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return res.status(403).json({ message: '비밀번호가 올바르지 않습니다.' });

  await updateUserPassword(req.user.id, newPassword);
  return res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
};

export const getMyProducts = async (req, res) => {
  const products = await getUserProducts(req.user.id);
  res.status(200).json(products);
};