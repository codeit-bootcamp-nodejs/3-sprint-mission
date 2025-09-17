import { Request, Response, NextFunction } from 'express';
import { readNotification, getNotificationList, getUnreadNotificationCount } from '../services/notificationService.js'
import { Notification } from '@prisma/client';

const notificationController = {

    readNotification: async (req: Request, res: Response): Promise<void> => {
        const id: number = parseInt(req.params.id);
        // 인증 미들웨어를 거치므로 반드시 있음
        const userId: number = req.user!.userId
        if (!id) {
            res.status(404).json({ message: 'Bad Request' })
        }
        const notification: Notification = await readNotification(id, userId);
        res.status(200).json(notification);
    },

    getUnreadCount: async (req: Request, res: Response): Promise<void> => {
        // 인증 미들웨어를 거치므로 반드시 있음
        const userId: number = req.user!.userId
        const unreadCount: number = await getUnreadNotificationCount(userId);
        res.status(200).json({ unreadCount })
    },

    getNotificationList: async (req: Request, res: Response): Promise<void> => {
        // 인증 미들웨어를 거치므로 반드시 있음
        const userId: number = req.user!.userId
        const notificationList: Notification[] = await getNotificationList(userId);
        res.status(200).json(notificationList)
    }
}

export default notificationController;