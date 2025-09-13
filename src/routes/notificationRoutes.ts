import { Router } from 'express';

import notificationRoutes from '../notifications/notificationRoutes.js';
import { authMiddleware } from '../auth/authMiddleware.js';

const router = Router();

router.use('/', authMiddleware, notificationRoutes);

export default router;
