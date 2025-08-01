import express, { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import uploadImage from '../middlewares/uploadMiddleware.js';
import { verifyAccessToken, optionalVerifyAccessToken, } from '../middlewares/auth.js';
import {
  validate, createArticleSchema,
  updateArticleSchema,
  getArticleByIdSchema,
  offsetQuerySchema,
} from '../middlewares/validationMiddleware.js';
import {
  findAllArticles,
  createArticle,
  findArticleById,
  updateArticle,
  toggleArticleLike,
  deleteArticle,
} from '../services/articleService.js';

const articleRouter: Router = express.Router();

articleRouter.route('/')
  .get(
    validate(offsetQuerySchema, 'query'),
    asyncHandler(
      async (req, res, next) => {
        const { offset, limit, sort, search } = req.query as {
          offset?: string;
          limit?: string;
          sort?: string;
          search?: string;
        };
        const articles = await findAllArticles({ offset, limit, sort, search });
        res.status(200).json({
          message: "조회하신 게시글 목록입니다.",
          data: articles
        });
      }))
  .post(
    verifyAccessToken,
    uploadImage.single('image'),
    validate(createArticleSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const userId = req.user!.userId
      const { title, content } = req.body as {
        title: string
        content: string
        imageUrl?: string
      };
      const imageUrl = req.file
        ? `/uploads/articles/${req.file.filename}`
        : null;
      const newArticle = await createArticle({ title, content, userId, imageUrl });
      res.status(201).json({
        message: "게시글 등록 완료",
        data: newArticle,
      });
    }));

articleRouter.route('/:articleId')
  .get(
    optionalVerifyAccessToken,
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { articleId } = req.params;
      const currentUserId = req.user?.userId
      const article = await findArticleById(articleId, currentUserId);
      res.status(200).json({
        message: "조회하신 게시글입니다",
        data: article,
      });
    }))
  .patch(
    verifyAccessToken,
    uploadImage.single('image'),
    validate(getArticleByIdSchema, 'params'),
    validate(updateArticleSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const userId = req.user!.userId
      const { articleId } = req.params;
      const updateData = req.body as {
        title?: string
        content?: string
        imageUrl?: string
      };

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
    verifyAccessToken,
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const userId = req.user!.userId
      const { articleId } = req.params;
      await deleteArticle(articleId, userId);
      res.status(204).end();
    })
  );

articleRouter.route('/:articleId/like')
  .post(
    verifyAccessToken,
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { articleId } = req.params;
      const loggedInUserId = req.user!.userId;
      const result = await toggleArticleLike(loggedInUserId, articleId);
      res.status(200).json(result);
    })
  );

export default articleRouter;