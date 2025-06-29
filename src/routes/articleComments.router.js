
import express from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import {
  CommentBaseSchema,
  UpdateCommentBaseSchema,
  getArticleByIdSchema,
  updateArticleCommentParamsSchema,
  DeleteCommentBaseSchema
} from '../middlewares/validation.middleware.js';
import * as articleCommentsService from '../services/articleComments.service.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(validate(getArticleByIdSchema, 'params'), asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, limit } = req.query;
    const { comments, nextCursor } = await articleCommentsService.findAllArticleComments({ articleId, cursor, limit });
    res.status(200).json({ comments, nextCursor });
  }))
  .post(
    validate(getArticleByIdSchema, 'params'),
    validate(CommentBaseSchema, 'body'),
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { content, userId } = req.body;
      const newComment = await articleCommentsService.createArticleComment({
        articleId,
        content,
        userId,
      });
      res.status(201).json(newComment);
    })
  );

router
  .route('/:id')
  .patch(
    validate(updateArticleCommentParamsSchema, 'params'),
    validate(UpdateCommentBaseSchema, 'body'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content, userId } = req.body;
      const updatedComment = await articleCommentsService.updateArticleComment(id, { content, userId });
      res.status(200).json(updatedComment);
    })
  )
  .delete(
    validate(updateArticleCommentParamsSchema, 'params'),
    validate(DeleteCommentBaseSchema, 'body'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { userId } = req.body;
      await articleCommentsService.deleteArticleComment(id, userId);
      res.status(204).send();
    })
  );

export default router;