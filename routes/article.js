import express from 'express'
import { deleteArticle, getArticle, getArticleList, patchArticle, postArticle } from '../controllers/article.controller.js'
import { deleteArticleComment, getArticleCommentList, patchArticleComment, postArticleComment } from '../controllers/comment.controller.js'

const articleRouter = express.Router()

articleRouter.route('/')
  .get(getArticleList)
  .post(postArticle)

articleRouter.route('/:id')
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle)

articleRouter.route('/:id/comments')
  .post(postArticleComment)
  .get(getArticleCommentList)

articleRouter.route('/:id/comments/:commentId')
  .patch(patchArticleComment)
  .delete(deleteArticleComment)

export default articleRouter