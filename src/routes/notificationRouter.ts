import express from "express";
import {getNotifications, getUnreadCount, markAsRead} from '../controllers/notificationController';
import { verifyAccessToken } from "../middlewares/auth";
import asyncHandler from  '../utils/asyncHandler';

const notificationRouter = express.Router();

notificationRouter.route('/')
    .get(verifyAccessToken, asyncHandler(getNotifications));

notificationRouter.route('/count')
    .get(verifyAccessToken, asyncHandler(getUnreadCount));

notificationRouter.route('/:notificationId/read')
    .patch(verifyAccessToken, asyncHandler(markAsRead));

export default notificationRouter;