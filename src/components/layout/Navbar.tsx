import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Calendar, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { auth } from '@/lib/firebase';
import ProfileDropdown from './ProfileDropdown';
import logoWithBackground from '@/assets/logo with Background.svg';
import { ModeToggle } from '@/components/mode-toggle';

export default function Navbar() {
    const { user, userRole } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Determine current view mode based on User Role
    const role = userRole?.toLowerCase();
    const isStudentView = role === 'student';
    const isTeacherView = role === 'teacher';

    const handleLogout = () => {
        auth.signOut();
        window.location.href = '/';
    };

    interface NavLinkItem {
        label: string;
        to: string;
        icon?: React.ElementType;
        children?: { label: string; to: string; }[];
    }

    const studentLinks: NavLinkItem[] = [
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Batches', to: '/student/batches' },
        {
            label: 'Find Teachers',
            to: '#',
            children: [
                { label: 'Find Tutors', to: '/student/search' },
                { label: 'My Requests', to: '/student/requests' }
            ]
        },
        {
            label: 'My Account',
            to: '#',
            children: [
                { label: 'My Teachers', to: '/student/saved' },
                { label: 'My Courses', to: '/student/courses' },
                { label: 'Your Resources', to: '/student/resources' },
                { label: 'Wallet', to: '/student/wallet' }
            ]
        },
        {
            label: 'How It Works',
            to: '#',
            children: [
                { label: 'About Us', to: '/about-us' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Become a Teacher', to: '/become-tutor' },
                { label: 'FAQs', to: '/faqs' }
            ]
        },
        { label: 'Corporate', to: '/corporate' }
    ];

    const teacherLinks: NavLinkItem[] = [
        { label: 'Dashboard', to: '/teacher/calendar', icon: LayoutDashboard },
        {
            label: 'Teaching',
            to: '/teacher/schedule',
            icon: Calendar,
            children: [
                { label: 'My Schedule', to: '/teacher/schedule' },
                { label: 'Requests', to: '/teacher/requests' },
                { label: 'Availability', to: '/teacher/availability' }
            ]
        },

        { label: 'Profile', to: '/teacher/profile', icon: User },
    ];

    const publicLinks: NavLinkItem[] = [
        { label: 'Find Tutors', to: '/search' },
        { label: 'Batches', to: '/search?tab=batches' },
        { label: 'Corporate', to: '/corporate' },
        { label: 'How It Works', to: '/how-it-works' },
        { label: 'About Us', to: '/about-us' },
        { label: 'Become a Teacher', to: '/become-tutor' },
    ];

    const getNavLinks = () => {
        if (!user) return publicLinks;
        if (isStudentView) return studentLinks;
        if (isTeacherView) return teacherLinks;
        return publicLinks;
    };

    const currentLinks = getNavLinks();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav className={`sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logoWithBackground} alt="TeacherDekho" className="h-10 w-auto rounded-lg" />
                    <span className="font-bold text-2xl tracking-tight font-serif text-slate-900 dark:text-slate-100">TeacherDekho</span>
                </Link>
                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {currentLinks.map((link) => (
                        <div key={link.label} className="relative group">
                            {link.children ? (
                                <>
                                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors rounded-lg group-hover:bg-slate-50 dark:group-hover:bg-slate-800">
                                        {link.icon && <link.icon size={16} className="mr-1" />}
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
                                    {link.icon && <link.icon size={16} className="mr-1" />}
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
                            <Link
                                to="/notifications"
                                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 transition-all"
                                title="Notifications"
                            >
                                <Bell size={20} />
                            </Link>
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
                <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 py-6 px-6 space-y-4 animate-in slide-in-from-top-2 duration-200 h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                        <ModeToggle />
                    </div>
                    {currentLinks.map((link) => (
                        <div key={link.label}>
                            {link.children ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-base font-medium text-slate-900 dark:text-slate-100 py-2">
                                        {link.icon && <link.icon size={18} />}
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
                                        flex items-center gap-2 py-2 text-base font-medium transition-colors
                                        ${isActive ? 'text-cyan-700' : 'text-slate-600 dark:text-slate-300'}
                                    `}
                                >
                                    {link.icon && <link.icon size={18} />}
                                    {link.label}
                                </NavLink>
                            )}
                        </div>
                    ))}

                    <div className="pt-4 flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                        {user ? (
                            <>
                                <Link
                                    to="/notifications"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 py-2 text-base font-medium text-slate-600 dark:text-slate-300"
                                >
                                    <Bell size={18} />
                                    Notifications
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 py-2 text-base font-medium text-red-500"
                                >
                                    <LogOut size={18} />
                                    Log Out
                                </button>
                            </>
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
