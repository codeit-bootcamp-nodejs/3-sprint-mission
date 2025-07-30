import express from 'express';
import validations from '../middlewares/validations.js';
import productController from '../controllers/productController.js';
import auth from '../middlewares/auth.js'

const productRouter = express.Router();

productRouter.route('/comment')
    .get(productController.getComments)
    .post(auth.verifyAccessToken, validations.createCommentValidation, productController.postComment)

productRouter.route('/comment/:id')
    .patch(auth.verifyAccessToken, auth.verifyProductCommentAuth, validations.patchCommentValidation, productController.patchComment)
    .delete(auth.verifyAccessToken, auth.verifyProductCommentAuth, productController.deleteComment)

productRouter.route('/liked')
    .get(auth.verifyAccessToken, productController.getLikedProducts)

productRouter.route('/')
    .get(productController.getProducts)
    .post(auth.verifyAccessToken, validations.createProductValidation, productController.postProduct)

productRouter.route('/:id')
    .get(auth.verifyAccessToken, productController.getProductById)
    .patch(auth.verifyAccessToken, auth.verifyProductAuth, validations.patchProductValidation, productController.patchProduct)
    .delete(auth.verifyAccessToken, auth.verifyProductAuth, productController.deleteProduct)

productRouter.route('/:id/like')
    .post(auth.verifyAccessToken, productController.likeProduct)

export default productRouter;