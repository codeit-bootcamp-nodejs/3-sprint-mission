import { RequestHandler } from 'express';
import  NotificationService  from './notification.service';
import { HttpError } from '../types/error';

//알림 리스트 불러오기
const getNotificationList:RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(new HttpError('인증이 필요합니다.', 401));
      }
      const notificationList = await NotificationService.getUserNotificationList(userId);
      res.json(notificationList);
    } catch (error) {
      next(new HttpError('알림 조회 중 오류가 발생했습니다.', 500));
    }
  }

  //안 읽은 알림 개수 불러오기
const getUnreadCount:RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(new HttpError('인증이 필요합니다.', 401));
      }
      const unreadCount = await NotificationService.getUserUnreadCount(userId);
      res.json(unreadCount);
    } catch (error) {
      next(new HttpError('안 읽은 알림 개수 조회 중 오류가 발생했습니다.', 500));
    }
};

//알림 읽음 처리하기
const markNotificationAsRead:RequestHandler = async (req, res, next) => {
    try {
      await NotificationService.markNotificationAsRead(req.params.notificationId);
      res.sendStatus(204);
    } catch (error) {
      next(new HttpError('알림 읽음 처리 중 오류가 발생했습니다.', 500));
    }
};

export default {
  getNotificationList,
  getUnreadCount,
  markNotificationAsRead
}
