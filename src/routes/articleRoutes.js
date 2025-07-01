import express from 'express';
import * as articleController from '../controllers/articleController.js';
import * as commentController from '../controllers/commentController.js';
import { validateArticle } from '../middlewares/articleValidator.js';
import { validateComment } from '../middlewares/commentValidator.js';

const router = express.Router();

// Article CRUD
router.route('/')
  .post(validateArticle, articleController.createArticle)
  .get(articleController.listArticles);

router.route('/:id')
  .get(articleController.getArticleById)
  .patch(validateArticle, articleController.updateArticle)
  .delete(articleController.deleteArticle);

// Article Comment
router.route('/:articleId/comments')
  .post(validateComment, commentController.createArticleComment)
  .get(commentController.getArticleComments);

export default router;