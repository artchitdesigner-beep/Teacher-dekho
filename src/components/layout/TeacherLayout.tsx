import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Calendar,
    Users,
    MessageSquare,
    BarChart2,
    Settings,
    Layers,
    Briefcase,
    CreditCard,
    Activity,
    LogOut,
    Menu,
    X,
    Bell,
    BookOpen // Added
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import logoWithBackground from '@/assets/logo with Background.svg';


export default function TeacherLayout() {
    const location = useLocation();
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: Calendar, label: 'Calendar', path: '/teacher/calendar' },
        { icon: Activity, label: 'Set Availability', path: '/teacher/availability' },
        { icon: BookOpen, label: 'Batches', path: '/teacher/batches' }, // Added Batches
        { icon: Users, label: 'My Students', path: '/teacher/students' },
        { icon: MessageSquare, label: 'Open Requests', path: '/teacher/requests' },
        { icon: BarChart2, label: 'Reports', path: '/teacher/reports' },
        { icon: Settings, label: 'Settings', path: '/teacher/profile' },
        { icon: Layers, label: 'Integrations', path: '/teacher/integrations' },
        { icon: Briefcase, label: 'Back office', path: '/teacher/back-office' },
        { icon: CreditCard, label: 'Expenses', path: '/teacher/expenses' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-white transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 flex flex-col
            `}>
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoWithBackground} alt="TeacherDekho" className="h-8 w-auto rounded-md" />
                        <span className="font-bold text-xl font-serif">TeacherDekho</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    to={item.path}
                                    className={`
                                        flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors relative
                                        ${isActive(item.path)
                                            ? 'bg-[#2c3b55] text-white border-l-4 border-orange-500'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                    {isActive(item.path) && (
                                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bottom Actions */}
                <div className="p-6 border-t border-slate-700">
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/';
                        }}
                        className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-medium w-full"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar (Desktop & Mobile) */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between shadow-sm z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-600 dark:text-slate-300">
                            <Menu size={24} />
                        </button>
                        <h1 className="font-bold text-lg text-slate-700 dark:text-slate-200 md:hidden">Teacher Panel</h1>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
                        <ProfileDropdown />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />

                    </div>
                </main>
            </div>
        </div>
    );
}
