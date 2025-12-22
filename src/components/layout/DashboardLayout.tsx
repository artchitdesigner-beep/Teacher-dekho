import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Menu } from 'lucide-react';
import { useState } from 'react';

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
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
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

    const isTeacher = role === 'teacher';

    return (
        <div className="min-h-screen bg-[#FDFCF8]">
            {/* Mobile Header */}
            <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-2 font-bold text-lg font-serif text-slate-900">
                    <div className={`${isTeacher ? 'bg-emerald-600' : 'bg-indigo-600'} text-white p-1 rounded`}>
                        <Menu size={16} />
                    </div>
                    TeacherDekho
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Sidebar with mobile overlay */}
            <Sidebar
                role={role}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="lg:pl-64 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
