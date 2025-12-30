import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, orderBy, limit } from 'firebase/firestore';
import { Bell, CheckCircle, XCircle, Info, Clock, Loader2, Check } from 'lucide-react';

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

export default function Notifications() {
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
                limit(50)
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

    const markAsRead = async (id: string) => {
        try {
            const docRef = doc(db, 'notifications', id);
            await updateDoc(docRef, { read: true });
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        if (unread.length === 0) return;

        try {
            const promises = unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }));
            await Promise.all(promises);
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
            case 'error': return <XCircle className="text-red-500" size={20} />;
            case 'warning': return <Info className="text-amber-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Notifications</h1>
                    <p className="text-sm text-slate-500">Stay updated with your class activities.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                        <Check size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No notifications yet</h3>
                        <p className="text-slate-500">We'll notify you when something important happens.</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => !notification.read && markAsRead(notification.id)}
                            className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer ${notification.read
                                ? 'bg-white border-slate-100 opacity-75'
                                : 'bg-white border-indigo-100 shadow-md shadow-indigo-50 ring-1 ring-indigo-50'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notification.read ? 'bg-slate-50' : 'bg-indigo-50'
                                    }`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className={`font-bold text-slate-900 text-sm md:text-base ${!notification.read ? 'pr-4' : ''}`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1.5" />
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-xs md:text-sm mb-2 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                        <Clock size={12} />
                                        {notification.createdAt.toDate().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
