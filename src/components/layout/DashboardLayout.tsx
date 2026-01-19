import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/lib/auth-context';
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-cyan-700" size={32} />
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
            {/* Navbar is now handled globally in App.tsx or we can include it here if it's not in PublicLayout */}
            {/* Since App.tsx wraps PublicLayout for public routes, but DashboardLayout is standalone, we need Navbar here or in App.tsx wrapping everything */}
            {/* Looking at App.tsx, DashboardLayout is used as a layout route. Let's check if Navbar is used there. */}
            {/* Actually, the previous design had a specific header in DashboardLayout. Now we want to use the common Navbar. */}

            <Navbar />

            {/* Main Content */}
            <main className="min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
