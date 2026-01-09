import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { Bell, CheckCircle, XCircle, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    read: boolean;
    createdAt: Timestamp;
    link?: string;
}

export default function DashboardNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    async function fetchNotifications() {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'notifications'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc'),
                limit(4)
            );
            const snap = await getDocs(q);
            const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(all);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-emerald-500" size={16} />;
            case 'error': return <XCircle className="text-red-500" size={16} />;
            case 'warning': return <Info className="text-amber-500" size={16} />;
            default: return <Info className="text-blue-500" size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-full animate-pulse">
                <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-16 bg-slate-50 dark:bg-slate-800 rounded-xl"></div>
                    <div className="h-16 bg-slate-50 dark:bg-slate-800 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Bell size={18} className="text-cyan-700" />
                    Notifications
                </h2>
                <Link to="/student/notifications" className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                </Link>
            </div>

            <div className="space-y-3 flex-grow">
                {notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8 text-slate-400">
                        <Bell size={24} className="mb-2 opacity-50" />
                        <p className="text-xs">No new notifications</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`p-3 rounded-xl border transition-all flex gap-3 ${notification.read
                                ? 'bg-slate-50 dark:bg-slate-950 border-transparent'
                                : 'bg-cyan-50/50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-900/30'
                                }`}
                        >
                            <div className="shrink-0 mt-0.5">
                                {getIcon(notification.type)}
                            </div>
                            <div className="min-w-0">
                                <h4 className={`text-sm font-bold text-slate-900 dark:text-slate-100 truncate ${!notification.read ? 'text-cyan-900 dark:text-cyan-100' : ''}`}>
                                    {notification.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {notification.message}
                                </p>
                                <div className="text-[10px] text-slate-400 mt-1">
                                    {notification.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
