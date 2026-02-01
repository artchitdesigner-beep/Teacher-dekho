import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ArrowLeftRight, LogOut, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/lib/auth-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileDropdown() {
    const { user, userRole, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    // Determine current view mode based on URL or User Role
    const isStudentView = userRole === 'student' || location.pathname.startsWith('/student');

    // Mock profile completion percentage
    const profileCompletion = 75;
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (profileCompletion / 100) * circumference;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all outline-none"
                >
                    {/* Circular Progress Bar */}
                    <svg className="absolute w-full h-full -rotate-90">
                        <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            className="text-slate-100 dark:text-slate-800"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="text-cyan-700 transition-all duration-1000"
                        />
                    </svg>

                    {/* Avatar */}
                    <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full flex items-center justify-center font-bold text-sm z-10">
                        {user.displayName?.[0] || user.email?.[0].toUpperCase() || 'U'}
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-xl border-slate-100 dark:border-slate-800">
                <DropdownMenuLabel className="px-4 py-3 font-normal">
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.displayName || 'User'}</div>
                    <div className="text-xs text-slate-500 truncate">{user.email}</div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="flex-grow h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-700 rounded-full" style={{ width: `${profileCompletion}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-cyan-700">{profileCompletion}%</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link
                        to={isStudentView ? '/student/profile' : '/teacher/profile'}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-cyan-700 dark:focus:text-cyan-400 cursor-pointer"
                    >
                        <User size={18} /> My Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-cyan-700 dark:focus:text-cyan-400 cursor-pointer"
                    >
                        <Settings size={18} /> Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-cyan-700 dark:focus:text-cyan-400 cursor-pointer"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-cyan-700 dark:focus:text-cyan-400 cursor-pointer"
                    onClick={async () => {
                        try {
                            const { doc, updateDoc } = await import('firebase/firestore');
                            const { db } = await import('@/lib/firebase');
                            const newRole = isStudentView ? 'teacher' : 'student';
                            await updateDoc(doc(db, 'users', user.uid), { role: newRole });
                            if (newRole === 'teacher') {
                                window.location.href = '/teacher/dashboard';
                            } else {
                                window.location.href = '/';
                            }
                        } catch (e) {
                            console.error('Error switching role:', e);
                            navigate(isStudentView ? '/teacher/dashboard' : '/');
                        }
                    }}
                >
                    <ArrowLeftRight size={18} /> Switch to {isStudentView ? 'Teacher' : 'Student'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-400 cursor-pointer"
                    onClick={() => {
                        logout();
                        window.location.href = '/';
                    }}
                >
                    <LogOut size={18} /> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
