import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Calendar, Clock, Video, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingDetailModal from '@/components/booking/BookingDetailModal';

interface Booking {
    id: string;
    teacherId: string;
    topic: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
    members?: { name: string; phone: string }[];
    teacherRemarks?: string;
    paymentStatus?: string;
}

export default function StudentDashboard() {
    const { user } = useAuth();
    const [upcomingClasses, setUpcomingClasses] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;

            try {
                const now = Timestamp.now();
                const bookingsRef = collection(db, 'bookings');

                // Fetch all bookings for this student
                const upcomingQuery = query(
                    bookingsRef,
                    where('studentId', '==', user.uid),
                    orderBy('scheduledAt', 'asc')
                );

                const upcomingSnap = await getDocs(upcomingQuery);
                const allBookings = upcomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

                // Filter in memory to avoid composite index requirement
                const filtered = allBookings.filter(b =>
                    (b.status === 'confirmed' || b.status === 'pending') &&
                    b.scheduledAt.toMillis() > now.toMillis()
                ).slice(0, 5);

                setUpcomingClasses(filtered);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [user]);

    if (loading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
        </div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-serif font-bold mb-2">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
                    <p className="text-indigo-100 mb-6 max-w-lg">Ready to learn something new today? Find the perfect mentor to help you master your subjects.</p>
                    <Link
                        to="/student/search"
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                    >
                        <Search size={20} />
                        Find a Teacher
                    </Link>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-500/50 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Classes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Upcoming Classes</h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={async () => {
                                    if (!user) return;
                                    setLoading(true);
                                    const { seedBookings } = await import('@/lib/seed');
                                    await seedBookings(user.uid, user.displayName || 'Student');
                                    window.location.reload();
                                }}
                                className="text-xs text-indigo-600 font-medium hover:underline"
                            >
                                Seed Demo
                            </button>
                            <Link to="/student/bookings" className="text-sm text-indigo-600 font-medium hover:underline">View all</Link>
                        </div>
                    </div>

                    {upcomingClasses.length === 0 ? (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-500">
                            <Calendar className="mx-auto mb-3 text-slate-300" size={32} />
                            <p className="mb-4">No upcoming classes scheduled.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingClasses.map(booking => (
                                <div key={booking.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 ${booking.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'} rounded-xl flex flex-col items-center justify-center text-xs font-bold`}>
                                            <span>{booking.scheduledAt.toDate().getDate()}</span>
                                            <span className="uppercase text-[10px]">{booking.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                {booking.topic}
                                                {booking.status === 'pending' && (
                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase tracking-wider">Pending</span>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                <Clock size={14} />
                                                {booking.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedBooking(booking)}
                                            className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            View Detail
                                        </button>
                                        {booking.status === 'confirmed' && (
                                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                                <Video size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/student/requests" className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Search size={20} />
                            </div>
                            <div className="font-bold text-slate-900">Post Request</div>
                            <div className="text-xs text-slate-500 mt-1">Ask for help</div>
                        </Link>
                        <Link to="/student/bookings" className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Calendar size={20} />
                            </div>
                            <div className="font-bold text-slate-900">Schedule</div>
                            <div className="text-xs text-slate-500 mt-1">View calendar</div>
                        </Link>
                    </div>
                </div>
            </div>

            {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
}
