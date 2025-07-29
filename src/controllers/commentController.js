import * as commentService from '../services/commentService.js';

export const createProductComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const productId = Number(req.params.productId);
    const userId = req.user.id;

    const comment = await commentService.createProductComment(productId, userId, content);
    return res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getProductComments = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId);
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const comments = await commentService.getProductComments(productId, { cursor, limit });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export const createArticleComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const articleId = Number(req.params.articleId);
    const userId = req.user.id;

    const comment = await commentService.createArticleComment(articleId, userId, content);
    return res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getArticleComments = async (req, res, next) => {
  try {
    const articleId = Number(req.params.articleId);
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const comments = await commentService.getArticleComments(articleId, { cursor, limit });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user.id;
    const { content } = req.body;

    const updated = await commentService.updateComment(commentId, userId, content);
    if (!updated) return res.status(404).json({ message: 'Comment not found' });

    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user.id;

    const deleted = await commentService.deleteComment(commentId, userId);
    if (!deleted) return res.status(404).json({ message: 'Comment not found' });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};