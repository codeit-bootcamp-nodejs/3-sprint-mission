import { Router } from 'express';
import { validateCreateProduct, validatePatchProduct } from '../middlewares/validateProduct';
import auth from '../middlewares/auth';
import ProductController from '../controllers/productController';

const productRouter = Router();

productRouter.route('/')
  .get(ProductController.getProductList)
  .post(validateCreateProduct, auth.verifyAccessToken, ProductController.createProduct);

productRouter.route('/:id')
  .get(ProductController.getProduct)
  .patch(validatePatchProduct, auth.verifyAccessToken, auth.authProductVerifyAuth, ProductController.patchProduct)
  .delete(auth.verifyAccessToken, auth.authProductVerifyAuth, ProductController.deleteProduct);

productRouter.route('/:id/like')
  .post(auth.verifyAccessToken, ProductController.likeProduct)
  .delete(auth.verifyAccessToken, ProductController.unlikeProduct);

productRouter.get('/:id/with-like', auth.verifyAccessToken, ProductController.getProductWithLike);

export default productRouter;