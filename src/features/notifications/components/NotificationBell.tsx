import { useState, useRef, useEffect } from 'react';
import { useNotifications, useMarkAsRead } from '../hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { data: notifications } = useNotifications();
    const markAsReadMutation = useMarkAsRead();
    const navigate = useNavigate();

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (id: string, relatedEntityId?: string, type?: string) => {
        setIsOpen(false);
        if (markAsReadMutation) {
            markAsReadMutation.mutate(id);
        }

        if (relatedEntityId) {
            if (type === 'order' || type === 'order_status_updated') navigate({ to: `/orders/${relatedEntityId}` });
            else if (type === 'association_request') navigate({ to: '/associations' });
            else if (type === 'payout') navigate({ to: `/payouts/${relatedEntityId}` });
            else if (type === 'aggregation_funded' || type === 'aggregation_approved') navigate({ to: `/aggregations/${relatedEntityId}` });
        }
    };

    return (
        <div ref={containerRef} className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-foreground/80 hover:text-foreground transition-colors"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-background"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-4 border-b border-border/50 bg-muted/10 flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {unreadCount} NEW
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications?.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <span className="text-3xl mb-2 block opacity-50">🔕</span>
                                <p className="text-xs font-bold uppercase tracking-wider">All caught up</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications?.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id, notification.userId, notification.type)}
                                        className={`w-full text-left p-4 hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 space-y-1">
                                                <p className={`text-sm ${!notification.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground/80 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                                <p className="text-[9px] font-bold uppercase tracking-wider text-primary opacity-60">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
