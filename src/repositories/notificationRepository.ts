import { Notification } from '@prisma/client';
import { prisma } from '../config/prismaClient';
import { CreateNotificationDTO } from '../types/notification';

class NotificationRepository {
    create = async (data: CreateNotificationDTO) => {
        const notification: Notification = await prisma.notification.create({
            data
        })
        return notification;
    }

    read = async (id: number): Promise<Notification> => {
        const readedNotification: Notification = await prisma.notification.update({
            where: {
                id,
            },
            data: { isChecked: true },
        });
        return readedNotification;
    }

    findUserIdById = async (id: number) => {
        const readedNotification = await prisma.notification.findUnique({
            where: {
                id,
            },
            select: { userId: true },
        });
        return readedNotification;
    }

    findNotificationListById = async (userId: number): Promise<Notification[]> => {
        const notificationList: Notification[] = await prisma.notification.findMany({
            where: {
                userId,
            },
        });
        return notificationList;
    }

    unreadCount = async (userId: number): Promise<number> => {
        const unreadCount: number = await prisma.notification.count({
            where: {
                userId,
                isChecked: false,
            },
        });
        return unreadCount;
    }
};

export default new NotificationRepository();