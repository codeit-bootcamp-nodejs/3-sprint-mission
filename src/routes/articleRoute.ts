import express from 'express'
import { deleteArticle, getArticle, getArticleList, patchArticle, postArticle } from '../controllers/articleController'
import { deleteArticleComment, getArticleCommentList, patchArticleComment, postArticleComment } from '../controllers/commentController'
import { validateArticle } from '../middlewares/validation'
import auth from '../middlewares/auth'

const articleRouter = express.Router()

articleRouter.route('/')
  .get(getArticleList)
  .post(auth.verifyAccessToken, validateArticle, postArticle)

articleRouter.route('/:id')
  .get(getArticle)
  .patch(auth.verifyAccessToken, auth.verifyArticleAuthorid, validateArticle, patchArticle)
  .delete(auth.verifyAccessToken, auth.verifyArticleAuthorid, deleteArticle)

articleRouter.route('/:id/comments')
  .post(auth.verifyAccessToken, postArticleComment)
  .get(getArticleCommentList)

articleRouter.route('/:id/comments/:commentId')
  .patch(auth.verifyAccessToken, auth.verifyArticleCommentUserid, patchArticleComment)
  .delete(auth.verifyAccessToken, auth.verifyArticleCommentUserid, deleteArticleComment)

export default articleRouter