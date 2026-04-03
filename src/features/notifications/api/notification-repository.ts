import type { Notification, NotificationCount } from "../types/notification";

export interface NotificationRepository {
    getNotifications(params?: { skip?: number; limit?: number }): Promise<Notification[]>;
    getUnreadCount(): Promise<NotificationCount>;
    markAsRead(notificationId: string): Promise<Notification>;
    markAllAsRead(): Promise<{ count: number }>;
    deleteNotification(notificationId: string): Promise<Notification>;
}
