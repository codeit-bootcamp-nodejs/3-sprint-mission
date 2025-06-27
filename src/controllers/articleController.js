import * as articleService from '../services/articleService.js';

export const createArticle = async (req, res, next) => {
  try {
    const article = await articleService.createArticle(req.body);
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

export const listArticles = async (req, res, next) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';

    const articles = await articleService.getArticleList(offset, limit, search);
    res.status(200).json(articles);
  } catch (err) {
    next(err);
  }
}

export const getArticleById = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(Number(req.params.id));
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
}

export const updateArticle = async (req, res, next) => {
  try {
    const updated = await articleService.updateArticle(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export const deleteArticle = async (req, res, next) => {
  try {
    const deleted = await articleService.deleteArticle(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Article not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}