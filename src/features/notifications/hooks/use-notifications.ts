import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationRepositoryImpl } from '../api/notification-repository-impl';
import {
    GetNotificationsUseCase,
    GetUnreadCountUseCase,
    MarkAsReadUseCase,
    MarkAllAsReadUseCase,
    DeleteNotificationUseCase
} from '../services';
import type { Notification, NotificationCount } from '../types/notification';

const repository = new NotificationRepositoryImpl();

const getNotificationsUseCase = new GetNotificationsUseCase(repository);
const getUnreadCountUseCase = new GetUnreadCountUseCase(repository);
const markAsReadUseCase = new MarkAsReadUseCase(repository);
const markAllAsReadUseCase = new MarkAllAsReadUseCase(repository);
const deleteNotificationUseCase = new DeleteNotificationUseCase(repository);

export const useNotifications = (params?: { skip?: number; limit?: number }) => {
    return useQuery<Notification[]>({
        queryKey: ['notifications', params],
        queryFn: () => getNotificationsUseCase.execute(params),
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useUnreadCount = () => {
    return useQuery<NotificationCount>({
        queryKey: ['notifications', 'unread-count'],
        queryFn: () => getUnreadCountUseCase.execute(),
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => markAsReadUseCase.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => markAllAsReadUseCase.execute(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteNotificationUseCase.execute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
        },
    });
};
