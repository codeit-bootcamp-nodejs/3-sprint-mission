import notificationRepository from '../repositories/notificationRepository.js';
import { Notification } from '@prisma/client';
import { CreateNotificationDTO } from '../types/notification.js';
import { io } from '../app.js';
import EventType from '../types/event-type.js';

const getUnreadNotificationCount = async (userId: number): Promise<number> => {
    const unreadCount: number = await notificationRepository.unreadCount(userId)
    return unreadCount;
}

const emitUnreadCount = async (userId : number): Promise<void> => {
    const unreadCount = await getUnreadNotificationCount(userId);
    io.to(userId.toString()).emit(EventType.UNREAD, { unreadCount });
}

const createNotification = async (createNotificationDTO: CreateNotificationDTO) => {
    const notification = await notificationRepository.create(createNotificationDTO);
    io.to(createNotificationDTO.userId.toString()).emit(EventType.NOTIFICATION, { notification })
    // 알람이 생성된 후에는 안읽음 개수가 늘어나므로 이벤트 전송
    await emitUnreadCount(createNotificationDTO.userId)
    return notification
}

const readNotification = async (id: number, userId: number): Promise<Notification> => {
    // 알람 읽음 처리
    const notification: Notification = await notificationRepository.read(id)
    // 읽은 후 안 읽은 개수가 줄어드니 개수 확인 후 전송
    await emitUnreadCount(userId);
    // 읽은 알람 추후 사용 가능할 수 있으므로 return
    return notification
}

const getNotificationList = async (userId: number): Promise<Notification[]> => {
    const notificationList: Notification[] = await notificationRepository.findNotificationListById(userId)
    return notificationList
}

export { getUnreadNotificationCount, emitUnreadCount, createNotification, readNotification, getNotificationList };

