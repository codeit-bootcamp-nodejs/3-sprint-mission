import express, { Router } from 'express';
import notificationController from '../controllers/notificationController';
import auth from '../middlewares/auth'

const notificationRouter: Router = express.Router();

notificationRouter.route('/')
    .get(auth.verifyAccessToken, notificationController.getNotificationList)

// http 리퀘스트로 요청 가능 + 알람 읽음처리시 socket.io에서 실시간으로 전달
notificationRouter.route('/unreadCount') 
    .get(auth.verifyAccessToken, notificationController.getUnreadCount)

notificationRouter.route('/:id')
    .post(auth.verifyAccessToken, notificationController.readNotification) // 읽음처리 이므로 돌리는 기능은 안되게 만들기

export default notificationRouter;