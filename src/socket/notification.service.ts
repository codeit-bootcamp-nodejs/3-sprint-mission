import NotificationRepository from './notification.repo';
import type { Notification, CreateNotificationDto } from './notification.dto';

const createNotification = async (data: CreateNotificationDto): Promise<Notification> => {
  return NotificationRepository.create(data);
};

const getUserNotificationList = async (userId: string): Promise<Notification[]> => {
  return NotificationRepository.findListByUserId(userId);
};

const getUserUnreadCount = async (userId: string): Promise<number> => {
  return await NotificationRepository.getUserUnreadCount(userId);
};

const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await NotificationRepository.markAsRead(notificationId);
};

export default {
  createNotification,
  getUserNotificationList,
  getUserUnreadCount,
  markNotificationAsRead
};
