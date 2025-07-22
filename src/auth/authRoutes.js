import express from 'express';
import { signup, login, refresh, logout } from './authController.js';
import { authMiddleware } from './authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);

export default router;