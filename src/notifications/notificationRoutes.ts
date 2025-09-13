import { Router } from 'express';
import * as controller from './notificationController.js';
import { authMiddleware } from '../auth/authMiddleware.js';

const router = Router();

/**
 * 로그인 요구
 */
router.use(authMiddleware);

/**
 * 알림 목록 조회
 */
router.get('/', controller.listNotifications);

/**
 * 안 읽은 알림 수
 */
router.get('/unread-count', controller.getUnreadCount);

/**
 * 단건 읽음 처리
 */
router.patch('/:id/read', controller.markAsRead);

/**
 * 일괄 읽음 처리
 */
router.patch('/read-all', controller.markAllAsRead);

export default router;
