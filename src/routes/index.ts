import { Router } from 'express';

import authRoutes from '../auth/authRoutes.js';
import articleRoutes from './articleRoutes.js';
import commentRoutes from './commentRoutes.js';
import productRoutes from './productRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import userRoutes from './userRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/me', userRoutes);
router.use('/products', productRoutes);
router.use('/articles', articleRoutes);
router.use('/upload', uploadRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);

export default router;
