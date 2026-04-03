import type { NotificationRepository } from '../api/notification-repository';
import type { Notification, NotificationCount } from '../types/notification';

export class GetNotificationsUseCase {
    private repository: NotificationRepository;
    constructor(repository: NotificationRepository) {
        this.repository = repository;
    }
    async execute(params?: { skip?: number; limit?: number }): Promise<Notification[]> {
        return this.repository.getNotifications(params);
    }
}

export class GetUnreadCountUseCase {
    private repository: NotificationRepository;
    constructor(repository: NotificationRepository) {
        this.repository = repository;
    }
    async execute(): Promise<NotificationCount> {
        return this.repository.getUnreadCount();
    }
}

export class MarkAsReadUseCase {
    private repository: NotificationRepository;
    constructor(repository: NotificationRepository) {
        this.repository = repository;
    }
    async execute(notificationId: string): Promise<Notification> {
        return this.repository.markAsRead(notificationId);
    }
}

export class MarkAllAsReadUseCase {
    private repository: NotificationRepository;
    constructor(repository: NotificationRepository) {
        this.repository = repository;
    }
    async execute(): Promise<{ count: number }> {
        return this.repository.markAllAsRead();
    }
}

export class DeleteNotificationUseCase {
    private repository: NotificationRepository;
    constructor(repository: NotificationRepository) {
        this.repository = repository;
    }
    async execute(notificationId: string): Promise<Notification> {
        return this.repository.deleteNotification(notificationId);
    }
}
