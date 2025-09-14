import { Router } from 'express';
import NotificationController from './notification.controller';
import auth from '../middlewares/auth';

const router = Router();

// Express용 JWT 인증 미들웨어 사용
router.use(auth.verifyAccessToken);

router.get('/', NotificationController.getNotificationList);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/:notificationId/read', NotificationController.markNotificationAsRead);

export default router;
