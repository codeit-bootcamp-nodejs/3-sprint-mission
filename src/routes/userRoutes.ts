import { Router } from 'express';

import { getLikedProducts, getLikedArticles } from '../controllers/likeController.js';
import { authMiddleware } from '../auth/authMiddleware.js';
import { getMyInfo, patchMyInfo, patchMyPassword, getMyProducts } from '../controllers/userController.js';

const router = Router();

router.route('/')
  .get(authMiddleware, getMyInfo)
  .patch(authMiddleware, patchMyInfo);

router.route('/password')
  .patch(authMiddleware, patchMyPassword);

router.route('/products')
  .get(authMiddleware, getMyProducts);

router.route('/likes/products')
  .get(authMiddleware, getLikedProducts);

router.route('/likes/articles')
  .get(authMiddleware, getLikedArticles);

export default router;