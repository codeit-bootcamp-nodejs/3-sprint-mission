import express, { Router } from 'express';
import validations from '../middlewares/validations';
import articleController from '../controllers/articleController';
import auth from '../middlewares/auth'

const articleRouter: Router = express.Router()

articleRouter.route('/comment')
    .get(articleController.getComments)
    .post(auth.verifyAccessToken, validations.createCommentValidation, articleController.postComment)

articleRouter.route('/comment/:id')
    .patch(auth.verifyAccessToken, auth.verifyArticleCommentAuth, validations.patchCommentValidation, articleController.patchComment)
    .delete(auth.verifyAccessToken, auth.verifyArticleCommentAuth, articleController.deleteComment)


articleRouter.route('/')
    .get(articleController.getArticles)
    .post(auth.verifyAccessToken, validations.createArticleValidation, articleController.postArticle)

articleRouter.route('/:id')
    .get(auth.verifyAccessToken, articleController.getArticleById)
    .patch(auth.verifyAccessToken, auth.verifyArticleAuth, validations.patchArticleValidation, articleController.patchArticle)
    .delete(auth.verifyAccessToken, auth.verifyArticleAuth, articleController.deleteArticle)

articleRouter.route('/:id/like')
    .post(auth.verifyAccessToken, articleController.likeArticle)

export default articleRouter;