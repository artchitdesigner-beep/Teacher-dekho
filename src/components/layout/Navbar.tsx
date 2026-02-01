import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import ProfileDropdown from './ProfileDropdown';
import logoWithBackground from '@/assets/logo with Background.svg';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, userRole } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Determine current view mode based on User Role
    const role = userRole?.toLowerCase();
    const isStudentView = role === 'student';
    const isTeacherView = role === 'teacher';

    interface NavLinkItem {
        label: string;
        to: string;
        children?: { label: string; to: string; }[];
    }

    const studentPrimaryLinks: NavLinkItem[] = [
        { label: 'Batches', to: '/student/batches' },
        { label: 'Find Tutors', to: '/student/search' },
        { label: 'My Courses', to: '/student/courses' },
    ];

    const studentSecondaryLinks: NavLinkItem[] = [
        {
            label: 'My Learning',
            to: '#',
            children: [
                { label: 'My Teachers', to: '/student/teachers' },
                { label: 'My Requests', to: '/student/requests' },
                { label: 'Your Resources', to: '/student/resources' },
                { label: 'Wallet', to: '/student/wallet' }
            ]
        },
        {
            label: 'More',
            to: '#',
            children: [
                { label: 'Corporate', to: '/corporate' },
                { label: 'About Us', to: '/about-us' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'FAQs', to: '/faqs' },
                { label: 'Become a Teacher', to: '/become-tutor' }
            ]
        }
    ];

    const teacherLinks: NavLinkItem[] = [
        { label: 'Dashboard', to: '/teacher/dashboard' },
        {
            label: 'Teaching',
            to: '/teacher/schedule',
            children: [
                { label: 'My Schedule', to: '/teacher/schedule' },
                { label: 'Requests', to: '/teacher/requests' },
                { label: 'Availability', to: '/teacher/availability' }
            ]
        },
        { label: 'Profile', to: '/teacher/profile' },
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
        if (!user) return { primary: publicLinks, secondary: [] };
        if (isStudentView) return { primary: studentPrimaryLinks, secondary: studentSecondaryLinks };
        if (isTeacherView) return { primary: teacherLinks, secondary: [] };
        return { primary: publicLinks, secondary: [] };
    };

    const { primary: primaryLinks, secondary: secondaryLinks } = getNavLinks();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Don't hide navbar on search pages to keep filter bar stable
            const isSearchPage = location.pathname.includes('/search') || location.pathname.includes('/batches');

            if (isSearchPage) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, location.pathname]);

    return (
        <nav className={cn(
            "sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-transform duration-300",
            !isVisible && "-translate-y-full"
        )}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex-1 flex items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoWithBackground} alt="TeacherDekho" className="h-10 w-auto rounded-lg" />
                        <span className="font-bold text-2xl tracking-tight font-serif text-slate-900 dark:text-slate-100">TeacherDekho</span>
                    </Link>
                </div>

                {/* Desktop Primary Navigation */}
                <div className="hidden lg:flex items-center gap-2">
                    {primaryLinks.map((link) => (
                        <div key={link.label}>
                            {link.children ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                            {link.label}
                                            <ChevronDown size={14} className="ml-1 opacity-50 transition-transform" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="p-2 w-48 rounded-xl border-slate-100 dark:border-slate-800">
                                        {link.children.map(child => (
                                            <DropdownMenuItem key={child.label} asChild>
                                                <Link
                                                    to={child.to}
                                                    className="w-full font-medium text-slate-600 dark:text-slate-300 focus:bg-cyan-50 dark:focus:bg-cyan-900/20 focus:text-cyan-700 dark:focus:text-cyan-400 rounded-lg"
                                                >
                                                    {child.label}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => cn(
                                        "px-3 py-2 text-sm font-semibold transition-all duration-200 rounded-lg",
                                        isActive
                                            ? 'text-cyan-700 bg-cyan-50/50 dark:bg-cyan-900/20'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-cyan-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    )}
                                >
                                    {link.label}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Side: Secondary Nav + Auth */}
                <div className="flex-1 hidden lg:flex items-center justify-end gap-4">
                    {/* Secondary Navigation (Dropdowns) */}
                    <div className="flex items-center gap-1 border-r border-slate-100 dark:border-slate-800 pr-4">
                        {secondaryLinks.map((link) => (
                            <div key={link.label}>
                                {link.children ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-cyan-700 dark:hover:text-cyan-400 p-2 h-auto">
                                                {link.label}
                                                <ChevronDown size={12} className="ml-1 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="p-2 w-48 rounded-xl border-slate-100 dark:border-slate-800">
                                            {link.children.map(child => (
                                                <DropdownMenuItem key={child.label} asChild>
                                                    <Link
                                                        to={child.to}
                                                        className="w-full text-xs font-semibold text-slate-600 dark:text-slate-300 focus:bg-cyan-50 dark:focus:bg-cyan-900/20 focus:text-cyan-700 dark:focus:text-cyan-400 rounded-lg capitalize"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) => cn(
                                            "text-[11px] font-bold uppercase tracking-wider px-2 py-1 transition-all duration-200",
                                            isActive ? 'text-cyan-700' : 'text-slate-400 dark:text-slate-500 hover:text-cyan-700 dark:hover:text-cyan-400'
                                        )}
                                    >
                                        {link.label}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                    </div>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/notifications"
                                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all"
                                title="Notifications"
                            >
                                <Bell size={20} />
                            </Link>
                            <ProfileDropdown />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-700 border-none bg-transparent h-auto p-0">
                                Log in
                            </Link>
                            <Button asChild className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-xl shadow-md shadow-cyan-700/10">
                                <Link to="/onboarding">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-slate-600 dark:text-slate-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 py-6 px-6 space-y-4 animate-in slide-in-from-top-2 duration-300 h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                        <ModeToggle />
                    </div>
                    {/* Mobile Menu Links */}
                    {[...primaryLinks, ...secondaryLinks].map((link) => (
                        <div key={link.label}>
                            {link.children ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100 py-2">
                                        {link.label}
                                    </div>
                                    <div className="pl-4 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                                        {link.children.map(child => (
                                            <Link
                                                key={child.label}
                                                to={child.to}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block py-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-400"
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
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-2 py-2 text-base font-bold transition-colors",
                                        isActive ? 'text-cyan-700' : 'text-slate-600 dark:text-slate-300'
                                    )}
                                >
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
                                <Button
                                    variant="ghost"
                                    className="justify-start px-0 h-auto text-base font-medium text-red-500 hover:text-red-600 hover:bg-transparent"
                                    onClick={async () => {
                                        const { auth } = await import('@/lib/firebase');
                                        auth.signOut();
                                        window.location.href = '/';
                                    }}
                                >
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="secondary" className="w-full py-6 font-semibold rounded-xl">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                                </Button>
                                <Button asChild className="w-full py-6 bg-cyan-700 hover:bg-cyan-800 font-semibold rounded-xl shadow-md shadow-cyan-700/10">
                                    <Link to="/onboarding" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
