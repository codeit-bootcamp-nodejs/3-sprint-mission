import * as articleService from '../services/articleService.js';
import { isTargetLiked } from '../services/likeService.js';

export const createArticle = async (req, res, next) => {
  try {
    const article = await articleService.createArticle({
      ...req.body,
      userId: req.user.id
    });

    return res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

export const listArticles = async (req, res, next) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';
    const articles = await articleService.getArticleList(offset, limit, search);

    return res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(Number(req.params.id));
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const userId = req.user?.id;
    const isLiked = userId ? await isTargetLiked(userId, article.id, 'article') : false;

    return res.status(200).json({ ...article, isLiked });
  } catch (err) {
    next(err);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const updated = await articleService.updateArticle(id, userId, req.body);
    if (!updated) return res.status(404).json({ message: 'Article not found' });

    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  };
};

export const deleteArticle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const deleted = await articleService.deleteArticle(id, userId);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};