import { Outlet, Navigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Menu, Heart } from 'lucide-react';
import { useState } from 'react';
import ProfileDropdown from './ProfileDropdown';


interface DashboardLayoutProps {
    role: 'student' | 'teacher';
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
    // Mocking auth for layout structure until context is ready
    // In real implementation, we check user role here
    const { user, loading, userRole } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (userRole && userRole !== role) {
        return <Navigate to={`/${userRole}/dashboard`} replace />;
    }



    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Dashboard Header */}
            <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-30 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 lg:hidden">TeacherDekho</h1>
                </div>

                <div className="flex items-center gap-4">

                    {role === 'student' && (
                        <div className="hidden md:flex items-center gap-2">

                            <Link
                                to="/student/saved"
                                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                title="Saved Teachers"
                            >
                                <Heart size={20} />
                            </Link>
                        </div>
                    )}
                    <ProfileDropdown />
                </div>
            </header>

            {/* Sidebar with mobile overlay */}
            <Sidebar
                role={role}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="lg:pl-64 min-h-screen transition-all duration-300 pt-20">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
