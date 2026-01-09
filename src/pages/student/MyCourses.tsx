import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Calendar, Video, Loader2, User, BookOpen, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/common/PageHero';

interface Session {
    id: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
}

interface Booking {
    id: string;
    teacherId: string;
    teacherName: string;
    studentId: string;
    topic: string;
    totalSessions: number;
    sessions: Session[];
    status: 'active' | 'pending' | 'completed' | 'rejected';
    paymentStatus: 'pending' | 'paid' | 'required';
    createdAt: Timestamp;
}

export default function MyCourses() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    async function fetchBookings() {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'bookings'),
                where('studentId', '==', user.uid)
            );
            const snap = await getDocs(q);
            const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
            setBookings(all.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = (b.topic?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (b.teacherName?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'active') return b.status === 'active';
        if (activeTab === 'pending') return b.status === 'pending';
        if (activeTab === 'completed') return b.status === 'completed';
        return false;
    });

    const getNextSession = (booking: Booking) => {
        const now = Date.now();
        return booking.sessions
            ?.filter(s => s.status === 'confirmed' && s.scheduledAt.toMillis() > now)
            .sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis())[0];
    };

    const getProgress = (booking: Booking) => {
        const completed = booking.sessions?.filter(s => s.status === 'completed').length || 0;
        const total = booking.totalSessions || booking.sessions?.length || 1;
        return { completed, total, percent: (completed / total) * 100 };
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <PageHero
                title="My Courses"
                description="Manage your ongoing courses and sessions."
            >
                <div className="max-w-xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-200" size={20} />
                        <input
                            type="text"
                            placeholder="Search by course or teacher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:ring-0 outline-none transition text-base text-white placeholder:text-cyan-200/70 shadow-lg"
                        />
                    </div>
                </div>
            </PageHero>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                {(['active', 'pending', 'completed'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab
                            ? 'bg-white dark:bg-slate-950 text-cyan-700 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <Calendar className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">No {activeTab} courses</h3>
                        <p className="text-slate-500 dark:text-slate-400">You don't have any courses in this category.</p>
                    </div>
                ) : (
                    filteredBookings.map(booking => {
                        const nextSession = getNextSession(booking);
                        const progress = getProgress(booking);

                        return (
                            <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${booking.paymentStatus === 'required' ? 'bg-red-50 text-red-600 animate-pulse' :
                                                booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {booking.paymentStatus === 'required' ? 'Payment Required' : `Payment: ${booking.paymentStatus}`}
                                            </span>
                                            <span className="text-slate-300 dark:text-slate-600">|</span>
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center gap-1">
                                                <User size={14} /> {booking.teacherName}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-cyan-700 transition-colors">
                                                {booking.topic}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <BookOpen size={16} className="text-cyan-500" />
                                                    {progress.completed}/{progress.total} Classes Completed
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full max-w-md">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider">
                                                <span>Course Progress</span>
                                                <span>{Math.round(progress.percent)}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-cyan-700 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 lg:min-w-[240px]">
                                        {nextSession ? (
                                            <div className="flex-grow p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl border border-cyan-100 dark:border-cyan-900/30">
                                                <div className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase mb-2">Next Class</div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex flex-col items-center justify-center font-bold text-cyan-700 shadow-sm">
                                                        <span className="text-sm">{nextSession.scheduledAt.toDate().getDate()}</span>
                                                        <span className="text-[8px] uppercase">{nextSession.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            {nextSession.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                                            {nextSession.scheduledAt.toDate().toLocaleDateString('en-US', { weekday: 'short' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-grow p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                                <p className="text-xs text-slate-400 font-medium">No upcoming classes scheduled</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/student/courses/${booking.id}`}
                                                className="flex-1 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:border-cyan-200 dark:hover:border-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all text-center"
                                            >
                                                View Course
                                            </Link>
                                            {nextSession && (
                                                <button className="p-3 bg-cyan-700 text-white rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-100 dark:shadow-none">
                                                    <Video size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
