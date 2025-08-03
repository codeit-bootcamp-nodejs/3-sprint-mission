import express, { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage } from '../middlewares/uploadMiddleware';
import {
  verifyAccessToken,
  optionalVerifyAccessToken,
} from '../middlewares/auth.js';
import {
  validate,
  createArticleSchema,
  updateArticleSchema,
  getArticleByIdSchema,
  offsetQuerySchema,
} from '../middlewares/validationMiddleware.js';
import {
  getAllArticles,
  createArticleController,
  getArticleById,
  updateArticleController,
  deleteArticleController,
  toggleArticleLikeController,
} from '../controllers/articleController';

const articleRouter: Router = express.Router();

articleRouter.route('/')
  .get(
    validate(offsetQuerySchema, 'query'),
    asyncHandler(getAllArticles)
  )
  .post(
    verifyAccessToken,
    uploadImage('article').single('image'),
    validate(createArticleSchema, 'body'),
    asyncHandler(createArticleController)
  );

articleRouter.route('/:articleId')
  .get(
    optionalVerifyAccessToken,
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(getArticleById)
  )
  .patch(
    verifyAccessToken,
    uploadImage('article').single('image'),
    validate(getArticleByIdSchema, 'params'),
    validate(updateArticleSchema, 'body'),
    asyncHandler(updateArticleController)
  )
  .delete(
    verifyAccessToken,
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(deleteArticleController)
  );

articleRouter.route('/:articleId/like')
  .post(
    verifyAccessToken,
    validate(getArticleByIdSchema, 'params'),
    asyncHandler(toggleArticleLikeController)
  );

export default articleRouter;