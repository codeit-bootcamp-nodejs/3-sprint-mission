import type { RequestHandler } from 'express';
import * as notificationService from './notificationService.js';

/**
 * @function listNotifications
 * @description 로그인한 사용자의 알림 목록을 조회합니다.
 */
export const listNotifications: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const notifications = await notificationService.list(userId, cursor, limit);
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

/**
 * @function getUnreadCount
 * @description 로그인한 사용자의 안 읽은 알림 개수를 반환합니다.
 */
export const getUnreadCount: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.countUnread(userId);
    res.status(200).json({ unreadCount: count });
  } catch (err) {
    next(err);
  }
};

/**
 * @function markAsRead
 * @description 특정 알림을 읽음 처리합니다.
 */
export const markAsRead: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const updated = await notificationService.markRead(id, userId);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * @function markAllAsRead
 * @description 모든 알림을 일괄 읽음 처리합니다.
 */
export const markAllAsRead: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const before = req.query.before ? new Date(String(req.query.before)) : undefined;

    const result = await notificationService.markReadAll(userId, before);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
