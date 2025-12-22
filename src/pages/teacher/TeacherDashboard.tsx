import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Booking {
    id: string;
    studentName: string; // We might need to fetch this separately or store it in booking
    topic: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
}

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [upcomingClasses, setUpcomingClasses] = useState<Booking[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;

            try {
                const now = Timestamp.now();
                const bookingsRef = collection(db, 'bookings');

                // Fetch all bookings for this teacher
                const allBookingsQuery = query(
                    bookingsRef,
                    where('teacherId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );

                const querySnap = await getDocs(allBookingsQuery);
                const allBookings = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

                // Filter in memory to avoid composite index requirement
                const upcoming = allBookings
                    .filter(b => b.status === 'confirmed' && b.scheduledAt.toMillis() > now.toMillis())
                    .sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis())
                    .slice(0, 3);

                const pending = allBookings
                    .filter(b => b.status === 'pending')
                    .slice(0, 3);

                setUpcomingClasses(upcoming);
                setPendingRequests(pending);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [user]);

    const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

    const handleStatusUpdate = async (bookingId: string, newStatus: 'confirmed' | 'rejected') => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                status: newStatus,
                teacherRemarks: remarks[bookingId] || '',
                updatedAt: Timestamp.now()
            });

            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update status.');
        }
    };

    if (loading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
        </div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back, {user?.displayName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg shadow-indigo-200">
                    <div className="text-indigo-200 text-sm font-medium mb-1">Total Earnings</div>
                    <div className="text-3xl font-bold">₹0</div>
                    <div className="mt-4 text-xs bg-indigo-500/50 inline-block px-2 py-1 rounded-lg">
                        +0% this month
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Active Students</div>
                    <div className="text-3xl font-bold text-slate-900">0</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Hours Taught</div>
                    <div className="text-3xl font-bold text-slate-900">0h</div>
                </div>
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
                                    await seedBookings(user.uid, user.displayName || 'Teacher');
                                    window.location.reload();
                                }}
                                className="text-xs text-indigo-600 font-medium hover:underline"
                            >
                                Seed Demo
                            </button>
                            <Link to="/teacher/schedule" className="text-sm text-indigo-600 font-medium hover:underline">View all</Link>
                        </div>
                    </div>

                    {upcomingClasses.length === 0 ? (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-500">
                            <Calendar className="mx-auto mb-3 text-slate-300" size={32} />
                            <p>No upcoming classes scheduled.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingClasses.map(booking => (
                                <div key={booking.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex flex-col items-center justify-center text-xs font-bold">
                                            <span>{booking.scheduledAt.toDate().getDate()}</span>
                                            <span className="uppercase text-[10px]">{booking.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{booking.topic}</div>
                                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                                <Clock size={14} />
                                                {booking.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                <span>•</span>
                                                <User size={14} />
                                                {booking.studentName}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                                        Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Requests */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Pending Requests</h2>
                        <Link to="/teacher/requests" className="text-sm text-indigo-600 font-medium hover:underline">View all</Link>
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-500">
                            <AlertCircle className="mx-auto mb-3 text-slate-300" size={32} />
                            <p>No pending requests.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingRequests.map(booking => (
                                <div key={booking.id} className="bg-white p-4 rounded-2xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                                                {booking.studentName[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{booking.studentName}</div>
                                                <div className="text-xs text-slate-500">{booking.isDemo ? 'Demo Class' : 'Regular Class'}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium text-slate-400">
                                            {booking.scheduledAt.toDate().toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="text-sm text-slate-900 font-medium mb-2">Topic: {booking.topic}</div>
                                        <textarea
                                            placeholder="Add a remark (optional)..."
                                            value={remarks[booking.id] || ''}
                                            onChange={e => setRemarks({ ...remarks, [booking.id]: e.target.value })}
                                            className="w-full p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                            className="flex-1 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                            className="flex-1 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
