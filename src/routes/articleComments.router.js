// src/routes/articleComments.router.js
import express from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createArticleCommentSchema,
  updateArticleCommentSchema,
  getArticleByIdSchema,
  updateArticleCommentParamsSchema
} from '../middlewares/validation.middleware.js';
import * as articleCommentsService from '../services/articleComments.service.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(validate(getArticleByIdSchema, 'params'), asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, limit } = req.query;
    const { comments, nextCursor } = await articleCommentsService.findAllArticleComments({ articlesId: articleId, cursor, limit });
    res.status(200).json({ comments, nextCursor });
  }))
  .post(
    validate(getArticleByIdSchema, 'params'),
    validate(createArticleCommentSchema, 'body'),
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { content, usersId } = req.body;
      const newComment = await articleCommentsService.createArticleComment({
        articlesId: articleId,
        content,
        usersId,
      });
      res.status(201).json(newComment);
    })
  );

router
  .route('/:id')
  .patch(
    validate(updateArticleCommentParamsSchema, 'params'),
    validate(updateArticleCommentSchema, 'body'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content, usersId } = req.body;
      const updatedComment = await articleCommentsService.updateArticleComment(id, { content, usersId });
      res.status(200).json(updatedComment);
    })
  )
  .delete(
    validate(updateArticleCommentParamsSchema, 'params'),
    validate(updateArticleCommentSchema, 'body'),
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { usersId } = req.body;
      await articleCommentsService.deleteArticleComment(id, usersId);
      res.status(204).send();
    })
  );

export default router;