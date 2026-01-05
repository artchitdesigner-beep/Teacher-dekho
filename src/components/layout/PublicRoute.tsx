import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

export default function PublicRoute() {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (user) {
        // Redirect to dashboard if already logged in
        const target = userRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
        return <Navigate to={target} replace />;
    }

    return <Outlet />;
}
