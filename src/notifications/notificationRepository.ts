import { Prisma, NotificationType, NotificationEntity } from "@prisma/client";
import prisma from "../prisma/prismaClient.js";
import { toDTO } from "./notificationMapper.js";
import type { NotificationDTO } from "./notificationTypes.js";

export const insert = async (data: {
  userId: number;
  type: NotificationType;
  entityType: NotificationEntity;
  entityId: number;
  title: string;
  body: string;
  metadata?: Prisma.InputJsonValue;
  dedupKey?: string | null;
}) => {
  const { userId, type, entityType, entityId, title, body } = data;
  const dedupKey = data.dedupKey?.trim() || undefined;
  const meta: Prisma.InputJsonValue = JSON.parse(
    JSON.stringify(data.metadata ?? {})
  );

  // if-else로 단순 방어코드 작성 시에 타입 에러(string | null | undefined) 발생하여 연산자 활용
  const row = dedupKey
    ? await prisma.notification.upsert({
        where: {
          userId_type_entityType_entityId_dedupKey: {
            userId,
            type,
            entityType,
            entityId,
            dedupKey,
          },
        },
        create: {
          userId,
          type,
          entityType,
          entityId,
          title,
          body,
          metadata: meta,
          dedupKey,
        },
        update: {},
      })
    : await prisma.notification.create({
        data: {
          userId,
          type,
          entityType,
          entityId,
          title,
          body,
          metadata: meta,
        },
      });

  return toDTO(row);
};

type FindByUserParams = { cursor?: number; limit: number };

export const findByUser = async (
  userId: number,
  opts: FindByUserParams
): Promise<NotificationDTO[]> => {
  const rows = await prisma.notification.findMany({
    where: {
      userId,
      ...(opts.cursor ? { id: { lt: opts.cursor } } : {}),
    },
    orderBy: { id: "desc" },
    take: opts.limit,
  });
  return rows.map(toDTO);
};
/**
 * 미확인 알림 개수 반환
 */
export const countUnread = async (userId: number): Promise<number> => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

/**
 * 단일 읽음 처리
 */
export const markRead = async (args: {
  id: number;
  userId: number;
}): Promise<NotificationDTO> => {
  const { id, userId } = args;

  const row = await prisma.notification.updateMany({
    where: { id, userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

  if (row.count === 0)
    throw new Error("읽지 않은 알림이 없거나 권한이 없습니다.");

  const updated = await prisma.notification.findUnique({ where: { id } });
  if (!updated) throw new Error("알림이 없습니다.");

  return toDTO(updated);
};

/**
 * 일괄 읽음 처리
 */
export const markReadBefore = async (
  args: { userId: number; before?: Date }
): Promise<number> => {
  const { userId, before } = args;

  const where = {
    userId,
    isRead: false,
    ...(before ? { createdAt: { lte: before } } : {}),
  };

  const res = await prisma.notification.updateMany({
    where,
    data: { isRead: true, readAt: new Date() },
  });

  return res.count;
};