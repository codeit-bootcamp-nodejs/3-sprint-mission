export enum NotificationType {
  PRICE_CHANGE = 'PRICE_CHANGE',
  NEW_COMMENT = 'NEW_COMMENT',
}

export enum NotificationEntity {
  PRODUCT = 'PRODUCT',
  COMMENT = 'COMMENT'
}

export interface NotificationDTO {
  id: number;
  userId: number;
  type: NotificationType;
  entityType: NotificationEntity;
  entityId: number;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
  readAt: Date | null;
}
