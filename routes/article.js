import express from 'express'
import { deleteArticle, getArticle, getArticleList, patchArticle, postArticle } from '../controllers/article.controller.js'

const articleRouter = express.Router()

articleRouter.route('/')
  .get(getArticleList)
  .post(postArticle)

articleRouter.route('/:id')
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle)

export default articleRouter