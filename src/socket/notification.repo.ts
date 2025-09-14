import prisma from '../config/prisma';
import type { Notification, CreateNotificationDto } from './notification.dto';


const create = async (data: CreateNotificationDto): Promise<Notification> => {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      message: data.message,
    },
  });
};

const findListByUserId = async (userId: string): Promise<Notification[]> => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

const getUserUnreadCount = async (userId: string): Promise<number> => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

const markAsRead = async (notificationId: string): Promise<void> => {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export default {
  create,
  findListByUserId,
  getUserUnreadCount,
  markAsRead,
};