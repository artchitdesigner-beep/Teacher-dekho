import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Calendar, Clock, Video, Loader2, User } from 'lucide-react';

interface Booking {
    id: string;
    studentName: string;
    topic: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
}

export default function TeacherSchedule() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
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
                where('status', '==', 'confirmed'),
                orderBy('scheduledAt', 'asc')
            );
            const snap = await getDocs(q);
            setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">My Schedule</h1>
                <p className="text-slate-500">Upcoming confirmed classes.</p>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                        <Calendar className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-slate-500">No upcoming classes scheduled.</p>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex flex-col items-center justify-center font-bold">
                                    <span className="text-lg">{booking.scheduledAt.toDate().getDate()}</span>
                                    <span className="text-[10px] uppercase">{booking.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{booking.topic}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {booking.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="flex items-center gap-1"><User size={14} /> {booking.studentName}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                                <Video size={20} />
                                Start Class
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
