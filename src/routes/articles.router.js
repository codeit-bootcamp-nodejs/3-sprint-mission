
import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { validate, createArticleSchema, updateArticleSchema, getArticleByIdSchema } from '../middlewares/validation.middleware.js';
import uploadImage from '../middlewares/upload.middleware.js';
import {
  findAllArticles,
  createArticle,
  findArticleById,
  updateArticle,
  deleteArticle
} from '../services/articles.service.js';

const articlerouter = express.Router();

articlerouter.route('/')
  .get(
    asyncHandler(async (req, res, next) => {
      const { offset, limit, sort, search } = req.query;
      const articles = await findAllArticles({ offset, limit, sort, search });
      res.status(200).json({
        message: "조회하신 게시글 목록입니다.",
        data: articles
      });
    }))
  .post(
    uploadImage.single('image'),
    validate(createArticleSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { title, content, userId } = req.body;
      const imageUrl = req.file
        ? `/uploads/articles/${req.file.filename}`
        : null;
      const newArticle = await createArticle({ title, content, userId, imageUrl });
      res.status(201).json({
        message: "게시글 등록 완료",
        data: newArticle,
      });
    }));

articlerouter.route('/:articleId')
  .get(
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { articleId } = req.params;
      const article = await findArticleById(articleId);
      res.status(200).json({
        message: "조회하신 게시글입니다",
        data: article,
      });
    }))
  .patch(
    uploadImage.single('image'),
    validate(getArticleByIdSchema, 'params'),
    validate(updateArticleSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { articleId } = req.params;
      const { userId, ...updateData } = req.body;
      if (req.file) {
        updateData.imageUrl = `/uploads/articles/${req.file.filename}`;
      }
      const patchArticle = await updateArticle(articleId, userId, updateData);
      res.status(200).json({
        message: "수정하신 게시글입니다",
        data: patchArticle,
      });
    }))
  .delete(
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { articleId } = req.params;
      const { userId } = req.body;
      await deleteArticle(articleId, userId);
      res.status(204).end();
    })
  );

export default articlerouter;