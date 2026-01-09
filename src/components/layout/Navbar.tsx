import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart, Wallet } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ProfileDropdown from './ProfileDropdown';
import logocyan from '@/assets/Logo cyan.svg';
import { ModeToggle } from '@/components/mode-toggle';

export default function Navbar() {
    const { user, userRole } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Determine current view mode based on URL or User Role
    const isStudentView = userRole === 'student' || location.pathname.startsWith('/student');

    const navLinks = [
        {
            label: 'Find a Tutor',
            to: '/search',
            children: [
                { label: 'Find Teacher', to: '/student/search' },
                { label: 'Batches', to: '/student/batches' },
                { label: 'Open Request', to: '/student/requests?action=new' }
            ]
        },
        { label: 'How It Works', to: '/how-it-works' },
        { label: 'Become a Tutor', to: '/become-tutor' },
        { label: 'About Us', to: '/about-us' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logocyan} alt="TeacherDekho" className="h-10 w-auto" />
                    <span className="font-bold text-2xl tracking-tight font-serif text-slate-900 dark:text-slate-100">TeacherDekho</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div key={link.label} className="relative group">
                            {link.children ? (
                                <>
                                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors rounded-lg group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                                        {link.label}
                                        <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                                    </button>
                                    <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 overflow-hidden">
                                            {link.children.map(child => (
                                                <Link
                                                    key={child.label}
                                                    to={child.to}
                                                    className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-700 dark:hover:text-cyan-400 rounded-lg transition-colors"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => `
                                        flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                                        ${isActive
                                            ? 'text-cyan-700 bg-cyan-50/50 dark:bg-cyan-900/20'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-cyan-700 hover:bg-slate-50 dark:hover:bg-slate-800'}
                                    `}
                                >
                                    {link.label}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>

                {/* Auth Buttons / Profile Dropdown */}
                <div className="hidden lg:flex items-center gap-4">

                    {user ? (
                        <div className="flex items-center gap-4">
                            {isStudentView && (
                                <>

                                    <Link
                                        to="/student/saved"
                                        className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        title="Saved Teachers"
                                    >
                                        <Heart size={20} />
                                    </Link>
                                </>
                            )}
                            <ProfileDropdown />
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-700 transition-colors">
                                Log in
                            </Link>
                            <Link
                                to="/onboarding"
                                className="px-5 py-2.5 bg-cyan-700 text-white text-sm font-semibold rounded-xl hover:bg-cyan-700 transition-all shadow-md shadow-cyan-700/10 active:scale-95"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 py-6 px-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                        <ModeToggle />
                    </div>
                    {navLinks.map((link) => (
                        <div key={link.label}>
                            {link.children ? (
                                <div className="space-y-2">
                                    <div className="text-base font-medium text-slate-900 dark:text-slate-100 py-2">
                                        {link.label}
                                    </div>
                                    <div className="pl-4 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                                        {link.children.map(child => (
                                            <Link
                                                key={child.label}
                                                to={child.to}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) => `
                                        block py-2 text-base font-medium transition-colors
                                        ${isActive ? 'text-cyan-700' : 'text-slate-600 dark:text-slate-300'}
                                    `}
                                >
                                    {link.label}
                                </NavLink>
                            )}
                        </div>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        {user && isStudentView && (
                            <>
                                <Link
                                    to="/student/wallet"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 py-2 text-base font-medium text-slate-600"
                                >
                                    <span className="w-8 h-8 bg-cyan-50 text-cyan-700 rounded-full flex items-center justify-center">
                                        <Wallet size={16} />
                                    </span>
                                    My Wallet (₹1,250)
                                </Link>
                                <Link
                                    to="/student/saved"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 py-2 text-base font-medium text-slate-600"
                                >
                                    <span className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                                        <Heart size={16} />
                                    </span>
                                    Saved Teachers
                                </Link>
                                <div className="h-px bg-slate-50 my-2" />
                            </>
                        )}
                        {user ? (
                            <Link
                                to={isStudentView ? '/student/dashboard' : '/teacher/dashboard'}
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full py-3 bg-cyan-700 text-white text-center font-semibold rounded-xl shadow-md shadow-cyan-700/10"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-3 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-center font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/onboarding"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-3 bg-cyan-700 text-white text-center font-semibold rounded-xl shadow-md shadow-cyan-700/10"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
