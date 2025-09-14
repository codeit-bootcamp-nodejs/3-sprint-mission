// 알림 관련 타입 정의
export interface Notification {
  id: string;
  userId: string;
  type: 'COMMENT' | 'LIKE';
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateNotificationDto = Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>;

// 소켓 이벤트 타입 정의
export enum EventType {
    LISTENING = 'listening',
    CONNECTION = 'connection',
    OPEN = 'open',
    MESSAGE = 'message',
    CLOSE = 'close',
    ERROR = 'error',
    DISCONNECT = 'disconnect'
};