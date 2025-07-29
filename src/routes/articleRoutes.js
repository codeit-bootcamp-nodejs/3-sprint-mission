import express from 'express';

import * as articleController from '../controllers/articleController.js';
import * as commentController from '../controllers/commentController.js';
import { validateArticle } from '../middlewares/articleValidator.js';
import { validateComment } from '../middlewares/commentValidator.js';
import { authMiddleware } from '../auth/authMiddleware.js';
import { authorize } from '../auth/authorizeMiddleware.js';
import { deleteArticleLike, postArticleLike } from '../controllers/likeController.js';

const router = express.Router();

// Article CRUD
router.route('/')
  .post(authMiddleware, validateArticle, articleController.createArticle)
  .get(articleController.listArticles);

router.route('/:id')
  .get(articleController.getArticleById)
  .patch(authMiddleware, authorize('article'), validateArticle, articleController.updateArticle)
  .delete(authMiddleware, authorize('article'), articleController.deleteArticle);

// Article Comment
router.route('/:articleId/comments')
  .post(authMiddleware, validateComment, commentController.createArticleComment)
  .get(commentController.getArticleComments);

router.route('/:id/like')
  .post(authMiddleware, postArticleLike)
  .delete(authMiddleware, deleteArticleLike);

export default router;