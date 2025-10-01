import { Router } from 'express';

import * as productController from '../controllers/productController.js';
import * as commentController from '../controllers/commentController.js';
import { validateProductCreate, validateProductUpdate } from '../middlewares/productValidator.js';
import { validateComment } from '../middlewares/commentValidator.js';
import { authMiddleware } from '../auth/authMiddleware.js';
import { authorize } from '../auth/authorizeMiddleware.js';
import { deleteProductLike, postProductLike } from '../controllers/likeController.js';

const router = Router();

// Product CRUD
router.route('/')
  .post(authMiddleware, validateProductCreate, productController.createProducts)
  .get(productController.listProducts);

router.route('/:id')
  .get(productController.getProductById)
  .patch(authMiddleware, validateProductUpdate, productController.updateProduct)
  .delete(authMiddleware, productController.deleteProduct);

// Product comment
router.route('/:productId/comments')
  .post(authMiddleware, validateComment, commentController.createProductComment)
  .get(commentController.getProductComments);

router.route('/:id/like')
  .post(authMiddleware, postProductLike)
  .delete(authMiddleware, deleteProductLike);

export default router;