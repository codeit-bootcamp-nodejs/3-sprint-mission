import express from 'express';
import { updateComment, deleteComment } from '../controllers/commentController.js';
import { validateComment } from '../middlewares/commentValidator.js';

const router = express.Router();

router.route('/:id')
  .patch(validateComment, updateComment)
  .delete(deleteComment);

export default router;