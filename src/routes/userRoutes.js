import express from 'express';

import { getLikedProducts, getLikedArticles } from '../controllers/likeController';
import { authMiddleware } from '../auth/authMiddleware';

const router = express.Router();

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