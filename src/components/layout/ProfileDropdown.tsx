import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Heart, ArrowLeftRight, LogOut, Wallet, Moon, Sun, MessageSquare } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/lib/auth-context';

export default function ProfileDropdown() {
    const { user, userRole, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation(); // Add useLocation
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    if (!user) return null;

    // Determine current view mode based on URL or User Role
    const isStudentView = userRole === 'student' || location.pathname.startsWith('/student');

    // Mock profile completion percentage
    const profileCompletion = 75;
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (profileCompletion / 100) * circumference;

    return (
        <div className="flex items-center gap-4">
            {isStudentView && (
                <Link to="/student/wallet" className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold hover:bg-indigo-100 transition-colors">
                    <Wallet size={16} />
                    <span>₹1,250</span>
                </Link>
            )}

            <div className="relative">
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-50 transition-all group"
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
                            className="text-slate-100"
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
                            className="text-indigo-600 transition-all duration-1000"
                        />
                    </svg>

                    {/* Avatar */}
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm z-10">
                        {user.displayName?.[0] || user.email?.[0].toUpperCase() || 'U'}
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsProfileOpen(false)}
                        />
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-indigo-100/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                <div className="font-bold text-slate-900 truncate">{user.displayName || 'User'}</div>
                                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${profileCompletion}%` }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-indigo-600">{profileCompletion}%</span>
                                </div>
                            </div>

                            <Link
                                to={isStudentView ? '/student/profile' : '/teacher/profile'}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <User size={18} /> View Profile
                            </Link>

                            {isStudentView && (
                                <>
                                    <Link
                                        to="/student/saved"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Heart size={18} /> Saved Teachers
                                    </Link>
                                    <Link
                                        to="/student/requests"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <MessageSquare size={18} /> My Requests
                                    </Link>
                                </>
                            )}

                            <button
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    navigate(isStudentView ? '/teacher/dashboard' : '/student/dashboard');
                                }}
                            >
                                <ArrowLeftRight size={18} /> Switch to {isStudentView ? 'Teacher' : 'Student'}
                            </button>

                            <button
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>

                            <div className="h-px bg-slate-50 my-2" />

                            <button
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    logout();
                                }}
                            >
                                <LogOut size={18} /> Log out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
