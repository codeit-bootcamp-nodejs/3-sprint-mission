import express from 'express';
import validations from '../middlewares/validations.js';
import articleController from '../controllers/articleController.js';

const articleRouter = express.Router()
articleRouter.use(express.json())

articleRouter.route('/comment')
    .get(articleController.getComments)
    .post(validations.createCommentValidation, articleController.postComment)

articleRouter.route('/comment/:id')
    .patch(validations.patchCommentValidation, articleController.patchComment)
    .delete(articleController.deleteComment)


articleRouter.route('/')
    .get(articleController.getArticles)
    .post(validations.createArticleValidation, articleController.postArticle)

articleRouter.route('/:id')
    .get(articleController.getArticleById)
    .patch(validations.patchArticleValidation, articleController.patchArticle)
    .delete(articleController.deleteArticle)


export default articleRouter;