import { NotificationDTO, NotificationEntity, NotificationType } from './notificationTypes.js'

/**
 * 프리즈마 → DTO
 */
export const toDTO = (row: any): NotificationDTO => ({
  id: row.id,
  userId: row.userId,
  type: row.type as NotificationType,
  entityType: row.entityType as NotificationEntity,
  entityId: row.entityId,
  title: row.title,
  body: row.body,
  metadata: row.metadata ?? {},
  isRead: row.isRead,
  createdAt: row.createdAt,
  readAt: row.readAt ?? null,
});
