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
                className="relative p-2 rounded-xl hover:bg-background-soft transition-colors focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border/50 bg-background-soft flex justify-between items-center">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[9px] font-bold bg-primary text-white px-2 py-0.5 rounded-full shadow-minimal">
                                {unreadCount} NEW
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications?.length === 0 ? (
                            <div className="p-10 text-center text-muted-foreground">
                                <span className="text-2xl mb-3 block opacity-30">🔕</span>
                                <p className="text-[10px] font-bold uppercase tracking-widest">All caught up</p>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications?.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id, notification.userId, notification.type)}
                                        className={`w-full text-left p-4 hover:bg-background-soft transition-colors border-b border-border/30 last:border-0 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 space-y-1">
                                                <p className={`text-[12px] ${!notification.isRead ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                                    {notification.body}
                                                </p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-primary opacity-60 pt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
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
