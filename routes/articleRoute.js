import express from 'express'
import { deleteArticle, getArticle, getArticleList, patchArticle, postArticle } from '../controllers/articleController.js'
import { deleteArticleComment, getArticleCommentList, patchArticleComment, postArticleComment } from '../controllers/commentController.js'
import { validateArticle } from '../middlewares/validation.js'
import auth from '../middlewares/auth.js'

const articleRouter = express.Router()

articleRouter.route('/')
  .get(getArticleList)
  .post(auth.verifyAccessToken, validateArticle, postArticle)

articleRouter.route('/:id')
  .get(getArticle)
  .patch(validateArticle, patchArticle)
  .delete(deleteArticle)

articleRouter.route('/:id/comments')
  .post(auth.verifyAccessToken, postArticleComment)
  .get(getArticleCommentList)

articleRouter.route('/:id/comments/:commentId')
  .patch(patchArticleComment)
  .delete(deleteArticleComment)

export default articleRouter