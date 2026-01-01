import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Heart, ArrowLeftRight, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ProfileDropdown() {
    const { user, userRole, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    if (!user) return null;

    // Mock profile completion percentage
    const profileCompletion = 75;
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (profileCompletion / 100) * circumference;

    return (
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
                            to={userRole === 'teacher' ? '/teacher/profile' : '/student/dashboard'}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            <User size={18} /> View Profile
                        </Link>

                        {userRole === 'student' && (
                            <Link
                                to="/student/saved"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <Heart size={18} /> Saved Teachers
                            </Link>
                        )}

                        <button
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            onClick={() => {
                                setIsProfileOpen(false);
                                navigate(userRole === 'teacher' ? '/student/dashboard' : '/teacher/dashboard');
                            }}
                        >
                            <ArrowLeftRight size={18} /> Switch to {userRole === 'teacher' ? 'Student' : 'Teacher'}
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
    );
}
