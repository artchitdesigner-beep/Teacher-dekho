import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, MessageSquare, Settings, LogOut, User, X, Bell, Layers, Users, Clock } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import logocyan from '@/assets/Logo cyan.svg';

interface SidebarProps {
    role: 'student' | 'teacher';
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', user.uid),
            where('read', '==', false)
        );
        const unsubscribe = onSnapshot(q, (snap) => {
            setUnreadCount(snap.size);
        });
        return () => unsubscribe();
    }, [user]);

    const handleLogout = () => {
        auth.signOut();
        window.location.href = '/';
    };

    const links = role === 'student'
        ? [
            { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/student/search', icon: Users, label: 'Find Teachers' },
            { to: '/student/batches', icon: Layers, label: 'Batches' },
            { to: '/student/courses', icon: Calendar, label: 'My Courses' },
            { to: '/notifications', icon: Bell, label: 'Notifications', badge: true },
        ]
        : [
            { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/teacher/requests', icon: MessageSquare, label: 'Requests' },
            { to: '/teacher/schedule', icon: Calendar, label: 'Schedule' },
            { to: '/teacher/availability', icon: Clock, label: 'Availability' },
            { to: '/teacher/profile', icon: User, label: 'Profile' },
            { to: '/notifications', icon: Bell, label: 'Notifications', badge: true },
        ];

    const isTeacher = role === 'teacher';
    const activeClass = isTeacher
        ? 'bg-emerald-50 text-emerald-600 font-medium'
        : 'bg-cyan-50 text-cyan-700 font-medium';
    const hoverClass = isTeacher
        ? 'hover:bg-emerald-50 hover:text-emerald-900'
        : 'hover:bg-slate-50 hover:text-slate-900';

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`
                w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <NavLink to="/" className="flex items-center gap-2">
                        <img src={logocyan} alt="TeacherDekho" className="h-8 w-auto" />
                        <span className="font-bold text-xl font-serif text-slate-900 dark:text-slate-100">TeacherDekho</span>
                    </NavLink>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                    ? activeClass
                                    : `text-slate-500 dark:text-slate-400 ${hoverClass}`
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <link.icon size={20} />
                                {link.label}
                            </div>
                            {link.badge && unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {unreadCount}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 transition-all">
                        <Settings size={20} />
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </aside>
        </>
    );
}
