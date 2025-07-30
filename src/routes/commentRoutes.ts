import { Router } from 'express';

import { updateComment, deleteComment } from '../controllers/commentController.js';
import { validateComment } from '../middlewares/commentValidator.js';
import { authMiddleware } from '../auth/authMiddleware.js';
import { authorize } from '../auth/authorizeMiddleware.js';

const router = Router();

router.route('/:id')
  .patch(authMiddleware, authorize('comment'), validateComment, updateComment)
  .delete(authMiddleware, authorize('comment'), deleteComment);

export default router;