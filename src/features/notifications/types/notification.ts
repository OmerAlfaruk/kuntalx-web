export interface Notification {
    id: string;
    userId: string;
    title: string;
    body: string;
    isRead: boolean;
    data?: Record<string, any>;
    createdAt: string;
    readAt?: string;
    type: string;
}

export interface NotificationCount {
    unreadCount: number;
}
