import express from 'express';
import validations from '../middlewares/validations.js';
import productController from '../controllers/productController.js';

const productRouter = express.Router();


productRouter.route('/comment')
    .get(productController.getComments)
    .post(validations.createCommentValidation, productController.postComment)

productRouter.route('/comment/:id')
    .patch(validations.patchCommentValidation, productController.patchComment)
    .delete(productController.deleteComment)

productRouter.route('/')
    .get(productController.getProducts)
    .post(validations.createProductValidation, productController.postProduct)

productRouter.route('/:id')
    .get(productController.getProductById)
    .patch(validations.patchProductValidation, productController.patchProduct)
    .delete(productController.deleteProduct)

export default productRouter;