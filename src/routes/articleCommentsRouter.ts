
import express from 'express';
import { verifyAccessToken } from '../middlewares/auth.js';
import {
  validate,
  CommentBaseSchema,
  getArticleByIdSchema,
  updateArticleCommentParamsSchema,
  paginationQuerySchema,
} from '../middlewares/validationMiddleware.js';
import * as articleCommentsService from '../services/articleCommentsService.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    validate(getArticleByIdSchema, 'params'),
    validate(paginationQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { cursor, limit } = req.query as { cursor?: string; limit?: string };
      const { comments, nextCursor } = await articleCommentsService.findAllArticleComments({ articleId, cursor, limit });
      res.status(200).json({ comments, nextCursor });
    }))
  .post(
    verifyAccessToken,
    validate(getArticleByIdSchema, 'params'),
    validate(CommentBaseSchema, 'body'),
    asyncHandler(async (req, res) => {
      const userId = req.user!.userId
      const { articleId } = req.params;
      const { content } = req.body as { content: string };
      const newComment = await articleCommentsService.createArticleComment({
        articleId,
        content,
        userId,
      });
      res.status(201).json(newComment);
    })
  );

router.route('/:id')
  .patch(
    verifyAccessToken,
    validate(updateArticleCommentParamsSchema, 'params'),
    validate(CommentBaseSchema, 'body'),
    asyncHandler(async (req, res) => {
      const userId = req.user!.userId
      const { id } = req.params;
      const { content } = req.body as { content: string };
      const updatedComment = await articleCommentsService.updateArticleComment(id, { content, userId });
      res.status(200).json(updatedComment);
    })
  )
  .delete(
    verifyAccessToken,
    validate(updateArticleCommentParamsSchema, 'params'),
    asyncHandler(async (req, res) => {
      const userId = req.user!.userId
      const { id } = req.params;
      await articleCommentsService.deleteArticleComment(id, userId);
      res.status(204).send();
    })
  );

export default router;