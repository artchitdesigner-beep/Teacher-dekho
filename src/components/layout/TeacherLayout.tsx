import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    BarChart2,
    UserCircle,
    UploadCloud,
    Briefcase,
    PenTool,
    Activity,
    LogOut,
    Menu,
    Bell,
    BookOpen,
    Compass
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import logoWithBackground from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';


export default function TeacherLayout() {
    const location = useLocation();
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
        { icon: Activity, label: 'Set Availability', path: '/teacher/availability' },
        { icon: BookOpen, label: 'Batches', path: '/teacher/batches' },
        { icon: Users, label: 'My Students', path: '/teacher/students' },
        { icon: MessageSquare, label: 'Open Requests', path: '/teacher/requests' },
        { icon: BarChart2, label: 'Reports', path: '/teacher/reports' },
        { icon: UserCircle, label: 'My Profile', path: '/teacher/profile' },
        { icon: UploadCloud, label: 'Resources', path: '/teacher/uploads' },
        { icon: Briefcase, label: 'Back office', path: '/teacher/back-office' },
        { icon: PenTool, label: 'Studio Setup', path: '/teacher/setup' },
    ];

    const isActive = (path: string) => location.pathname === path;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0f172a] dark:bg-slate-950 text-white">
            {/* Logo Area */}
            <div className="p-8 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/20">
                    <img src={logoWithBackground} alt="T" className="h-8 w-auto brightness-0 invert" />
                </div>
                <div>
                    <span className="font-extrabold text-xl tracking-tight block leading-none">Teacher</span>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Dekho Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4 py-8">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-2xl relative group
                                    ${active
                                        ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                <item.icon size={18} className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'} transition-colors`} />
                                <span>{item.label}</span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Pro Feature Card Spare */}
                <div className="mt-8 p-4 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-cyan-600/10 rounded-full blur-2xl group-hover:bg-cyan-600/20 transition-all"></div>
                    <Compass className="text-cyan-500 mb-2" size={24} />
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">New Feature</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-3">AI lesson planning is now available in "Studio Setup".</p>
                    <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-400 border-cyan-800 text-[8px] px-2">Beta</Badge>
                </div>
            </ScrollArea>

            {/* Bottom Actions */}
            <div className="p-8 border-t border-white/5 bg-black/10">
                <button
                    onClick={() => {
                        logout();
                        window.location.href = '/';
                    }}
                    className="flex items-center gap-3 text-slate-400 hover:text-rose-400 transition-all text-sm font-black uppercase tracking-widest w-full group"
                >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-rose-500/10 group-hover:scale-110 transition-all">
                        <LogOut size={16} />
                    </div>
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col flex-shrink-0 animate-in fade-in slide-in-from-left duration-700">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-950/50">
                {/* Top Bar */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu size={24} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 border-none">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>

                        <div className="hidden md:block">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Teacher <span className="text-slate-900 dark:text-white">Workspace</span></h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Server</span>
                        </div>

                        <button className="relative p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-cyan-600 hover:border-cyan-200 transition-all group">
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>

                        <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>

                        <div className="flex items-center gap-3">
                            <div className="hidden lg:block text-right">
                                <div className="text-sm font-black text-slate-900 dark:text-white leading-none">Prime Account</div>
                                <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-tighter mt-1 italic">Knowledge Partner</div>
                            </div>
                            <ProfileDropdown />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto p-6 md:p-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
