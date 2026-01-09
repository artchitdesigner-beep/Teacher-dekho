import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Calendar, Clock, Video, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Session {
    id: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
}

interface Booking {
    id: string;
    studentName: string;
    topic: string;
    sessions: Session[];
    status: 'active' | 'pending' | 'completed' | 'rejected';
}

interface FlattenedSession extends Session {
    bookingId: string;
    studentName: string;
    topic: string;
}

export default function TeacherSchedule() {
    const { user } = useAuth();
    const [upcomingSessions, setUpcomingSessions] = useState<FlattenedSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchSchedule();
    }, [user]);

    async function fetchSchedule() {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'bookings'),
                where('teacherId', '==', user.uid),
                where('status', 'in', ['active', 'pending'])
            );
            const snap = await getDocs(q);
            const allBookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

            const now = Date.now();
            const flattened: FlattenedSession[] = [];

            allBookings.forEach(booking => {
                booking.sessions?.forEach(session => {
                    if (session.status === 'confirmed' && session.scheduledAt.toMillis() > now) {
                        flattened.push({
                            ...session,
                            bookingId: booking.id,
                            studentName: booking.studentName,
                            topic: booking.topic
                        });
                    }
                });
            });

            // Sort by time
            flattened.sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis());
            setUpcomingSessions(flattened);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="animate-spin text-cyan-700" size={32} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">My Schedule</h1>
                <p className="text-slate-500">All upcoming confirmed sessions across your active courses.</p>
            </div>

            <div className="space-y-4">
                {upcomingSessions.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                        <Calendar className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-slate-500">No upcoming sessions scheduled.</p>
                    </div>
                ) : (
                    upcomingSessions.map((session, idx) => (
                        <div key={`${session.bookingId}-${idx}`} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-cyan-50 text-cyan-700 rounded-xl flex flex-col items-center justify-center font-bold">
                                    <span className="text-lg">{session.scheduledAt.toDate().getDate()}</span>
                                    <span className="text-[10px] uppercase">{session.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div>
                                    <Link to={`/teacher/bookings/${session.bookingId}`} className="font-bold text-slate-900 text-lg mb-1 hover:text-cyan-700 transition-colors block">
                                        {session.topic}
                                    </Link>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {session.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="flex items-center gap-1"><User size={14} /> {session.studentName}</span>
                                        {session.isDemo && <span className="text-[10px] font-bold bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded uppercase">Demo</span>}
                                    </div>
                                </div>
                            </div>

                            <button className="px-6 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all flex items-center justify-center gap-2">
                                <Video size={20} />
                                Start Session
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
