import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ProfileDropdown from './ProfileDropdown';
import logoIndigo from '@/assets/Logo Indigo.svg';

export default function Navbar() {
    const { user, userRole } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { label: 'Find a Tutor', to: '/search', hasDropdown: true },
        { label: 'How It Works', to: '/how-it-works', hasDropdown: true },
        { label: 'Become a Tutor', to: '/onboarding', hasDropdown: true },
        { label: 'About Us', to: '/about-us', hasDropdown: true },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#FDFCF8]/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logoIndigo} alt="TeacherDekho" className="h-10 w-auto" />
                    <span className="font-bold text-2xl tracking-tight font-serif text-slate-900">TeacherDekho</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            className={({ isActive }) => `
                                flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                                ${isActive
                                    ? 'text-indigo-600 bg-indigo-50/50'
                                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}
                            `}
                        >
                            {link.label}
                            {link.hasDropdown && <ChevronDown size={14} className="opacity-50" />}
                        </NavLink>
                    ))}
                </div>

                {/* Auth Buttons / Profile Dropdown */}
                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <ProfileDropdown />
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                Log in
                            </Link>
                            <Link
                                to="/onboarding"
                                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 active:scale-95"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-b border-slate-100 py-6 px-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) => `
                                block py-2 text-base font-medium transition-colors
                                ${isActive ? 'text-indigo-600' : 'text-slate-600'}
                            `}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        {user ? (
                            <Link
                                to={userRole === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full py-3 bg-indigo-600 text-white text-center font-semibold rounded-xl shadow-md shadow-indigo-600/10"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-3 bg-slate-50 text-slate-600 text-center font-semibold rounded-xl border border-slate-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/onboarding"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full py-3 bg-indigo-600 text-white text-center font-semibold rounded-xl shadow-md shadow-indigo-600/10"
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
