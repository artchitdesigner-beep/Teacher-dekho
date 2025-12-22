import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Calendar, Clock, Video, Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Booking {
    id: string;
    teacherId: string;
    topic: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
}

export default function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

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
            // Memory sort
            setBookings(all.sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis()));
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">My Bookings</h1>
                <p className="text-slate-500">Manage your upcoming classes.</p>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                        <Calendar className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-slate-500">No bookings yet. Find a teacher to get started!</p>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-xl flex flex-col items-center justify-center font-bold shrink-0">
                                    <span className="text-base md:text-lg">{booking.scheduledAt.toDate().getDate()}</span>
                                    <span className="text-[8px] md:text-[10px] uppercase">{booking.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 text-base md:text-lg truncate">{booking.topic}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                            booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {booking.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        {booking.isDemo && <span className="bg-indigo-50 text-indigo-600 px-2 rounded text-[10px] font-bold">DEMO</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                                <Link
                                    to={`/student/bookings/${booking.id}`}
                                    className="flex-1 md:flex-none px-3 py-2 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 border border-slate-100 md:border-transparent"
                                >
                                    Details
                                    <ChevronRight size={16} />
                                </Link>
                                {booking.status === 'confirmed' && (
                                    <button className="flex-1 md:flex-none px-4 py-2 md:px-6 md:py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                        <Video size={18} className="md:w-5 md:h-5" />
                                        Join
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
