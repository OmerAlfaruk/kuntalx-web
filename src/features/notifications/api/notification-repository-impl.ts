import { apiClient } from '../../../lib/api-client';
import type { Notification, NotificationCount } from '../types/notification';
import type { NotificationRepository } from './notification-repository';

export class NotificationApiDataSource {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static mapToNotification(data: any): Notification {
        return {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            body: data.message || data.body || '',
            isRead: data.is_read,
            data: data.data,
            createdAt: data.created_at,
            readAt: data.read_at,
            type: data.type,
        };
    }

    async getNotifications(params?: { skip?: number; limit?: number }): Promise<Notification[]> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await apiClient.get<any[]>('/notifications/', { params });
        return data.map(NotificationApiDataSource.mapToNotification);
    }

    async getUnreadCount(): Promise<NotificationCount> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await apiClient.get<any>('/notifications/unread-count');
        return {
            unreadCount: data.unread_count
        };
    }

    async markAsRead(notificationId: string): Promise<Notification> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await apiClient.patch<any>(`/notifications/${notificationId}/read`);
        return NotificationApiDataSource.mapToNotification(data);
    }

    async markAllAsRead(): Promise<{ count: number }> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await apiClient.post<any>('/notifications/mark-all-as-read');
        return {
            count: data.count
        };
    }

    async deleteNotification(notificationId: string): Promise<Notification> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await apiClient.delete<any>(`/notifications/${notificationId}`);
        return NotificationApiDataSource.mapToNotification(data);
    }
}

export class NotificationRepositoryImpl implements NotificationRepository {
    private apiDataSource: NotificationApiDataSource;

    constructor() {
        this.apiDataSource = new NotificationApiDataSource();
    }

    async getNotifications(params?: { skip?: number; limit?: number }): Promise<Notification[]> {
        return this.apiDataSource.getNotifications(params);
    }

    async getUnreadCount(): Promise<NotificationCount> {
        return this.apiDataSource.getUnreadCount();
    }

    async markAsRead(notificationId: string): Promise<Notification> {
        return this.apiDataSource.markAsRead(notificationId);
    }

    async markAllAsRead(): Promise<{ count: number }> {
        return this.apiDataSource.markAllAsRead();
    }

    async deleteNotification(notificationId: string): Promise<Notification> {
        return this.apiDataSource.deleteNotification(notificationId);
    }
}
