import { likeTarget, unlikeTarget, isTargetLiked, getUserLikedProducts, getUserLikedArticles } from '../services/likeService';

export const postProductLike = async (req, res) => {
  const type = 'product';
  const userId = req.user.id;
  const targetId = Number(req.params.id);
  if (!Number.isInteger(targetId) || targetId <= 0) return res.status(400).json({ message: '대상 ID가 올바르지 않습니다.' });

  const isLiked = await isTargetLiked(userId, targetId, type);
  if (isLiked) return res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });

  await likeTarget(userId, targetId, type);
  return res.status(201).json({ message: '좋아요가 등록되었습니다.' });
};

export const deleteProductLike = async (req, res) => {
  const type = 'product';
  const userId = req.user.id;
  const targetId = Number(req.params.id);
  if (!Number.isInteger(targetId) || targetId <= 0) return res.status(400).json({ message: '대상 ID가 올바르지 않습니다.' });

  await unlikeTarget(userId, targetId, type);
  return res.status(200).json({ message: '좋아요가 취소되었습니다' });
};

export const postArticleLike = async (req, res) => {
  const type = 'article';
  const userId = req.user.id;
  const targetId = Number(req.params.id);
  if (!Number.isInteger(targetId) || targetId <= 0) return res.status(400).json({ message: '대상 ID가 올바르지 않습니다.' });

  const isLiked = await isTargetLiked(userId, targetId, type);
  if (isLiked) return res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });

  await likeTarget(userId, targetId, type);
  return res.status(201).json({ message: '좋아요가 등록되었습니다.' });
};

export const deleteArticleLike = async (req, res) => {
  const type = 'article';
  const userId = req.user.id;
  const targetId = Number(req.params.id);
  if (!Number.isInteger(targetId) || targetId <= 0) return res.status(400).json({ message: '대상 ID가 올바르지 않습니다.' });

  await unlikeTarget(userId, targetId, type);
  return res.status(200).json({ message: '좋아요가 취소되었습니다' });
};

export const getLikedProducts = async (req, res) => {
  const userId = req.user.id;
  const products = await getUserLikedProducts(userId);
  res.status(200).json(products);
};

export const getLikedArticles = async (req, res) => {
  const userId = req.user.id;
  const articles = await getUserLikedArticles(userId);
  res.status(200).json(articles);
};