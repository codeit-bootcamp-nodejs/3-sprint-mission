import { getIO } from '../ws/index.js';
import { userRoom } from '../ws/rooms.js';
import { EVT_NOTIFICATION_NEW, EVT_NOTIFICATION_READ, EVT_NOTIFICATION_READ_ALL } from '../ws/events.js';
import type { NotificationDTO } from './notificationTypes.js';

/**
 * 알림 브로드캐스트
 */
export const broadcast = (userId: number, payload: NotificationDTO) => {
  try {
    const io = getIO();
    io.to(userRoom(userId)).emit(EVT_NOTIFICATION_NEW, payload);
  } catch {}
};


/**
 * 읽음 동기화 처리
 */
export const emitRead = (userId: number, notificationId: number): void => {
  try {
    const io = getIO();
    io.to(userRoom(userId)).emit(EVT_NOTIFICATION_READ, { id: notificationId });
  } catch {}
};

export const emitReadAll = (userId: number, affected: number): void => {
  try {
    const io = getIO();
    io.to(userRoom(userId)).emit(EVT_NOTIFICATION_READ_ALL, { affected });
  } catch {}
};
