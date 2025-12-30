import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { Clock } from 'lucide-react';
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
    totalSessions: number;
    sessions: Session[];
    status: 'active' | 'pending' | 'completed' | 'rejected';
    paymentStatus: 'pending' | 'paid' | 'required';
    createdAt: Timestamp;
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
                const bookingsRef = collection(db, 'bookings');

                // Fetch all bookings for this teacher
                const allBookingsQuery = query(
                    bookingsRef,
                    where('teacherId', '==', user.uid)
                );

                const querySnap = await getDocs(allBookingsQuery);
                const allBookings = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

                // Sort and filter in memory
                const sortedAll = [...allBookings].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

                const upcoming = allBookings
                    .filter(b => b.status === 'active' || b.status === 'pending')
                    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
                    .slice(0, 6);

                const pending = sortedAll
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

    const handleStatusUpdate = async (bookingId: string, newStatus: 'active' | 'rejected') => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                status: newStatus,
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sm:col-span-2 lg:col-span-1">
                    <div className="text-slate-500 text-sm font-medium mb-1">Hours Taught</div>
                    <div className="text-3xl font-bold text-slate-900">0h</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Courses */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Active Courses</h2>
                        <Link to="/teacher/schedule" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingClasses.length === 0 ? (
                            <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                                <p className="text-slate-400">No active courses found.</p>
                            </div>
                        ) : (
                            upcomingClasses.map(booking => {
                                const completedSessions = booking.sessions?.filter(s => s.status === 'completed').length || 0;
                                const nextSession = booking.sessions?.find(s => s.status === 'confirmed' && s.scheduledAt.toMillis() > Date.now());

                                return (
                                    <Link
                                        key={booking.id}
                                        to={`/teacher/bookings/${booking.id}`}
                                        className="block p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{booking.topic}</h3>
                                                <p className="text-xs text-slate-500">Student: {booking.studentName}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${booking.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                                <span>Progress</span>
                                                <span>{completedSessions}/{booking.totalSessions} Sessions</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${(completedSessions / booking.totalSessions) * 100}%` }}
                                                ></div>
                                            </div>
                                            {nextSession && (
                                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                                    <Clock size={14} className="text-indigo-500" />
                                                    Next: {nextSession.scheduledAt.toDate().toLocaleDateString()} at {nextSession.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">New Requests</h2>
                        <Link to="/teacher/requests" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {pendingRequests.length === 0 ? (
                            <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                                <p className="text-slate-400">No pending requests.</p>
                            </div>
                        ) : (
                            pendingRequests.map(booking => (
                                <div key={booking.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{booking.topic}</h3>
                                            <p className="text-xs text-slate-500">From: {booking.studentName}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Requested On</div>
                                            <div className="text-xs font-bold text-slate-900">{booking.createdAt.toDate().toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'active')}
                                            className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                            className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
