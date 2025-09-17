import { Notification } from '@prisma/client'

export type CreateNotificationDTO = Pick<Notification, 'content' | 'userId' >