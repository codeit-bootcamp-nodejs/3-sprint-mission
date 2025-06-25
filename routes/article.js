import express from 'express'
import { getArticle, getArticleList } from '../controllers/article.controller.js'

const articleRouter = express.Router()

articleRouter.route('/')
  .get(getArticleList)
  .post((req, res) => {
    res.json({ message: '게시글 등록하기' })
  })

articleRouter.route('/:id')
  .get(getArticle)
  .patch((req, res) => {
    res.json({ message: '게시글 수정하기' })
  })
  .delete((req, res) => {
    res.json({ message: '게시글 삭제하기' })
  })

export default articleRouter