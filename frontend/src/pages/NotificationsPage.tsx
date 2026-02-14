import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import MotionReveal from '@/components/MotionReveal';
import SectionDivider from '@/components/SectionDivider';

interface NotificationItem {
    _id: string;
    type: 'like' | 'comment' | 'follow';
    sender: { _id: string; name: string; username: string };
    blog?: { _id: string; title: string };
    read: boolean;
    createdAt: string;
}

const typeConfig = {
    like: { icon: Heart, label: 'liked your article', color: 'text-saffron' },
    comment: { icon: MessageCircle, label: 'commented on', color: 'text-indigo-light' },
    follow: { icon: UserPlus, label: 'started following you', color: 'text-green-400' },
};

export default function NotificationsPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [isAuthenticated, navigate]);

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        const unread = notifications.filter((n) => !n.read);
        await Promise.all(unread.map((n) => api.patch(`/notifications/${n._id}/read`)));
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border border-text-muted border-t-indigo rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <section className="pt-16 pb-8">
                <div className="max-w-2xl mx-auto px-6 lg:px-12">
                    <MotionReveal>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted mb-2">Activity</p>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary">
                                    Notifications
                                </h1>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-text-muted hover:text-indigo-light transition-colors"
                                >
                                    <Check size={11} />
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </MotionReveal>
                </div>
            </section>

            <SectionDivider className="max-w-2xl mx-auto px-6 lg:px-12" />

            <section className="py-8 pb-24">
                <div className="max-w-2xl mx-auto px-6 lg:px-12">
                    {notifications.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-text-muted text-sm">No notifications yet.</p>
                            <p className="text-text-muted/60 text-xs mt-2">
                                When someone likes, comments, or follows you, it'll show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {notifications.map((notification, i) => {
                                const config = typeConfig[notification.type];
                                const Icon = config.icon;

                                return (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.03 }}
                                        className={
                                            'flex items-start gap-4 py-4 border-b border-border cursor-pointer group transition-colors duration-300 ' +
                                            (!notification.read ? 'bg-indigo/[0.03]' : '')
                                        }
                                        onClick={() => {
                                            if (!notification.read) markAsRead(notification._id);
                                            if (notification.type === 'follow') {
                                                navigate(`/profile/${notification.sender.username}`);
                                            } else if (notification.blog) {
                                                navigate(`/blogs`);
                                            }
                                        }}
                                    >
                                        {/* Icon */}
                                        <div className={'mt-0.5 ' + config.color}>
                                            <Icon size={14} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-text-secondary leading-relaxed">
                                                <span className="text-text-primary font-medium">
                                                    {notification.sender.name}
                                                </span>{' '}
                                                {config.label}
                                                {notification.blog && (
                                                    <>
                                                        {' '}
                                                        <span className="text-text-primary">
                                                            "{notification.blog.title}"
                                                        </span>
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-1">
                                                {formatDate(notification.createdAt)}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {!notification.read && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo mt-2 flex-shrink-0" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
