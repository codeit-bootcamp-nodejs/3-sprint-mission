import { Router } from 'express';

import * as articleController from '../controllers/articleController.js';
import * as commentController from '../controllers/commentController.js';
import { validateArticleCreate, validateArticleUpdate } from '../middlewares/articleValidator.js'
import { validateComment } from '../middlewares/commentValidator.js';
import { authMiddleware } from '../auth/authMiddleware.js';
import { deleteArticleLike, postArticleLike } from '../controllers/likeController.js';

const router = Router();

// Article CRUD
router.route('/')
  .post(authMiddleware, validateArticleCreate, articleController.createArticle)
  .get(articleController.listArticles);

router.route('/:id')
  .get(articleController.getArticleById)
  .patch(authMiddleware, validateArticleUpdate, articleController.updateArticle)
  .delete(authMiddleware, articleController.deleteArticle);

// Article Comment
router.route('/:articleId/comments')
  .post(authMiddleware, validateComment, commentController.createArticleComment)
  .get(commentController.getArticleComments);

router.route('/:id/likes')
  .post(authMiddleware, postArticleLike)
  .delete(authMiddleware, deleteArticleLike);

export default router;