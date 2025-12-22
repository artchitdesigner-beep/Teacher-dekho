import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, Settings, LogOut, User, X } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface SidebarProps {
    role: 'student' | 'teacher';
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
    const handleLogout = () => {
        auth.signOut();
        window.location.href = '/';
    };

    const links = role === 'student'
        ? [
            { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/student/search', icon: BookOpen, label: 'Find Teachers' },
            { to: '/student/bookings', icon: Calendar, label: 'My Bookings' },
            { to: '/student/requests', icon: MessageSquare, label: 'My Requests' },
        ]
        : [
            { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/teacher/requests', icon: MessageSquare, label: 'Requests' },
            { to: '/teacher/schedule', icon: Calendar, label: 'Schedule' },
            { to: '/teacher/profile', icon: User, label: 'Profile' },
        ];

    const isTeacher = role === 'teacher';
    const activeClass = isTeacher
        ? 'bg-emerald-50 text-emerald-600 font-medium'
        : 'bg-indigo-50 text-indigo-600 font-medium';
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
                w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl font-serif text-slate-900">
                        <div className={`${isTeacher ? 'bg-emerald-600' : 'bg-indigo-600'} text-white p-1 rounded`}>
                            <LayoutDashboard size={16} fill="currentColor" />
                        </div>
                        TeacherDekho
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
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
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? activeClass
                                    : `text-slate-500 ${hoverClass}`
                                }`
                            }
                        >
                            <link.icon size={20} />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                        <Settings size={20} />
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </aside>
        </>
    );
}
