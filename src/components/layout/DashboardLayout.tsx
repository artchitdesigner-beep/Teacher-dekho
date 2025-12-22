import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '@/lib/auth-context'; // We'll create this next
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
    role: 'student' | 'teacher';
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
    // Mocking auth for layout structure until context is ready
    // In real implementation, we check user role here
    const { user, loading, userRole } = useAuth();

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

    return (
        <div className="min-h-screen bg-[#FDFCF8]">
            <Sidebar role={role} />
            <main className="pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
