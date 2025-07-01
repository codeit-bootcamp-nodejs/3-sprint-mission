import express from 'express';
import * as productController from '../controllers/productController.js';
import * as commentController from '../controllers/commentController.js';
import { validateProduct } from '../middlewares/productValidator.js';
import { validateComment } from '../middlewares/commentValidator.js';

const router = express.Router();

// Product CRUD
router.route('/')
  .post(validateProduct, productController.createProducts)
  .get(productController.listProducts);

router.route('/:id')
  .get(productController.getProductById)
  .patch(validateProduct, productController.updateProduct)
  .delete(productController.deleteProduct);

// Product comment
router.route('/:productId/comments')
  .post(validateComment, commentController.createProductComment)
  .get(commentController.getProductComments);

export default router;