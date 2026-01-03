import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Calendar, Video, Loader2, User, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">My Courses</h1>
                    <p className="text-sm md:text-base text-slate-500">Manage your ongoing courses and sessions.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                {(['active', 'pending', 'completed'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No {activeTab} courses</h3>
                        <p className="text-slate-500">You don't have any courses in this category.</p>
                    </div>
                ) : (
                    filteredBookings.map(booking => {
                        const nextSession = getNextSession(booking);
                        const progress = getProgress(booking);

                        return (
                            <div key={booking.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${booking.paymentStatus === 'required' ? 'bg-red-50 text-red-600 animate-pulse' :
                                                booking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {booking.paymentStatus === 'required' ? 'Payment Required' : `Payment: ${booking.paymentStatus}`}
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                                                <User size={14} /> {booking.teacherName}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                                {booking.topic}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <BookOpen size={16} className="text-indigo-500" />
                                                    {progress.completed}/{progress.total} Classes Completed
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full max-w-md">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                                                <span>Course Progress</span>
                                                <span>{Math.round(progress.percent)}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress.percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 lg:min-w-[240px]">
                                        {nextSession ? (
                                            <div className="flex-grow p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                                <div className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Next Class</div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex flex-col items-center justify-center font-bold text-indigo-600 shadow-sm">
                                                        <span className="text-sm">{nextSession.scheduledAt.toDate().getDate()}</span>
                                                        <span className="text-[8px] uppercase">{nextSession.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900">
                                                            {nextSession.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500">
                                                            {nextSession.scheduledAt.toDate().toLocaleDateString('en-US', { weekday: 'short' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-grow p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                                <p className="text-xs text-slate-400 font-medium">No upcoming classes scheduled</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/student/courses/${booking.id}`}
                                                className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:border-indigo-200 hover:text-indigo-600 transition-all text-center"
                                            >
                                                View Course
                                            </Link>
                                            {nextSession && (
                                                <button className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
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
