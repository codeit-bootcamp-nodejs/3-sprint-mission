import { Server, Socket } from "socket.io";
import { eventBus } from "../config/event-bus";
import notificationService from "./notification.service";

// io를 주입받아 이벤트버스 리스너를 등록
export const setupNotificationEventBus = (io: Server) => {
  eventBus.on("newNotification", (notification) => {
    const { userId } = notification;
    console.log("새 알림 전송:", notification);
    io.to(`notification:${userId}`).emit("notification", notification);
    // 안 읽은 개수도 함께 전송
    notificationService.getUserUnreadCount(userId).then((count) => {
      io.to(`notification:${userId}`).emit("unreadCount", { count });
    });
  });
};

//알림 읽기 처리
export const notificationRead = (socket: Socket) => {
  socket.on("notificationRead", async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      // 읽음 처리 후 안 읽은 개수 업데이트
      const userId = socket.data?.user?.userId;
      if (userId) {
        const count = await notificationService.getUserUnreadCount(userId);
        socket.emit("unreadCount", { count });
        console.log(`안 읽은 개수 업데이트: ${count}`);
      }
    } catch (error) {
      console.error("읽음 처리 오류:", error);
    }
  });
};
