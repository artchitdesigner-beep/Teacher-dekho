import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Calendar, Clock, Video, Search, MessageSquare, Plus, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    createdAt: Timestamp;
}

import BatchCard from '@/components/batches/BatchCard';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [upcomingClasses, setUpcomingClasses] = useState<Booking[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;

            try {
                const now = Timestamp.now();

                // 1. Fetch Bookings
                const bookingsRef = collection(db, 'bookings');
                const upcomingQuery = query(bookingsRef, where('studentId', '==', user.uid));
                const upcomingSnap = await getDocs(upcomingQuery);
                const allBookings = upcomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

                const filteredBookings = allBookings
                    .filter(b => (b.status === 'confirmed' || b.status === 'pending') && b.scheduledAt.toMillis() > now.toMillis())
                    .sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis())
                    .slice(0, 5);
                setUpcomingClasses(filteredBookings);

                // 2. Fetch Batches
                const batchesSnap = await getDocs(collection(db, 'batches'));
                setBatches(batchesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // 3. Fetch Open Requests
                const requestsQuery = query(collection(db, 'open_requests'), where('studentId', '==', user.uid));
                const requestsSnap = await getDocs(requestsQuery);
                const allRequests = requestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by createdAt desc
                setRequests(allRequests.sort((a: any, b: any) => b.createdAt.toMillis() - a.createdAt.toMillis()).slice(0, 3));

                // 4. Fetch Notifications
                const notifQuery = query(collection(db, 'notifications'), where('userId', '==', user.uid));
                const notifSnap = await getDocs(notifQuery);
                const allNotifs = notifSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by createdAt desc
                setNotifications(allNotifs.sort((a: any, b: any) => b.createdAt.toMillis() - a.createdAt.toMillis()).slice(0, 3));

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
            <div className="bg-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
                    <p className="text-indigo-100 mb-6 max-w-lg text-sm md:text-base">Ready to learn something new today? Find the perfect mentor to help you master your subjects.</p>
                    <Link
                        to="/student/search"
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors text-sm md:text-base"
                    >
                        <Search size={18} />
                        Explore Teachers & Batches
                    </Link>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-indigo-500/50 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Upcoming Classes */}
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
                                    <div className="flex items-center gap-2 md:gap-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 ${booking.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'} rounded-xl flex flex-col items-center justify-center text-[10px] md:text-xs font-bold shrink-0`}>
                                            <span>{booking.scheduledAt.toDate().getDate()}</span>
                                            <span className="uppercase text-[8px] md:text-[10px]">{booking.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-slate-900 flex items-center gap-2 truncate">
                                                <span className="truncate">{booking.topic}</span>
                                                {booking.status === 'pending' && (
                                                    <span className="text-[8px] md:text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">Pending</span>
                                                )}
                                            </div>
                                            <div className="text-xs md:text-sm text-slate-500 flex items-center gap-2">
                                                <Clock size={12} className="md:w-3.5 md:h-3.5" />
                                                {booking.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <Link
                                            to={`/student/bookings/${booking.id}`}
                                            className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                                        >
                                            View
                                        </Link>
                                        {booking.status === 'confirmed' && (
                                            <button className="p-1.5 md:p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                                <Video size={18} className="md:w-5 md:h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Requests & Notifications */}
                <div className="space-y-8">
                    {/* Open Requests */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Your Requests</h2>
                            <Link to="/student/requests" className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                <Plus size={16} /> New Request
                            </Link>
                        </div>

                        {requests.length === 0 ? (
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-slate-500">
                                <MessageSquare className="mx-auto mb-3 text-slate-300" size={24} />
                                <p className="text-sm mb-3">No active requests.</p>
                                <Link to="/student/requests" className="text-xs font-bold text-indigo-600 hover:underline">Post a requirement</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {requests.map(req => (
                                    <Link key={req.id} to="/student/requests" className="block bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${req.status === 'open' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {req.status}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{req.createdAt?.toDate().toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm truncate mb-1 group-hover:text-indigo-600 transition-colors">{req.topic}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-1">{req.description}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                            <Link to="/notifications" className="text-sm text-indigo-600 font-medium hover:underline">View all</Link>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-slate-500">
                                <Bell className="mx-auto mb-3 text-slate-300" size={24} />
                                <p className="text-sm">No new notifications.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map(notif => (
                                    <div key={notif.id} className={`bg-white p-4 rounded-2xl border ${notif.read ? 'border-slate-100 opacity-75' : 'border-indigo-100 shadow-sm'} flex gap-3`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                            <Bell size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{notif.title}</p>
                                            <p className="text-xs text-slate-500 line-clamp-1">{notif.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{notif.createdAt?.toDate().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Featured Batches Carousel */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Featured Batches</h2>
                    <Link to="/student/search?tab=batches" className="text-sm text-indigo-600 font-medium hover:underline">View all</Link>
                </div>

                {batches.length === 0 ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-500">
                        <p>No featured batches available at the moment.</p>
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                        {batches.map(batch => (
                            <div key={batch.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                <BatchCard batch={batch} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
