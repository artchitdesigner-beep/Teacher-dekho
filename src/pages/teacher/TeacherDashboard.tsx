import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { Clock, Gift, X } from 'lucide-react';
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
    teacherRemark?: string;
}

import ReferralModal from '@/components/common/ReferralModal';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [upcomingClasses, setUpcomingClasses] = useState<Booking[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReferralModal, setShowReferralModal] = useState(false);

    // Remark Modal State
    const [remarkModal, setRemarkModal] = useState<{ isOpen: boolean, bookingId: string | null, action: 'active' | 'rejected' | null }>({
        isOpen: false,
        bookingId: null,
        action: null
    });
    const [remarkText, setRemarkText] = useState('');
    const [processing, setProcessing] = useState(false);

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

    const openRemarkModal = (bookingId: string, action: 'active' | 'rejected') => {
        setRemarkModal({ isOpen: true, bookingId, action });
        setRemarkText('');
    };

    const handleStatusUpdate = async () => {
        if (!remarkModal.bookingId || !remarkModal.action) return;

        setProcessing(true);
        try {
            const bookingRef = doc(db, 'bookings', remarkModal.bookingId);
            await updateDoc(bookingRef, {
                status: remarkModal.action,
                teacherRemark: remarkText,
                updatedAt: Timestamp.now()
            });

            // Refresh data (Optimistic update or reload)
            window.location.reload();
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Failed to update status.');
        } finally {
            setProcessing(false);
            setRemarkModal({ isOpen: false, bookingId: null, action: null });
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
                <Link to="/teacher/wallet" className="bg-cyan-700 text-white p-6 rounded-3xl shadow-lg shadow-cyan-200 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="text-cyan-200 text-sm font-medium mb-1">Total Earnings</div>
                    <div className="text-3xl font-bold">₹12,500</div>
                    <div className="mt-4 text-xs bg-cyan-500/50 inline-block px-2 py-1 rounded-lg">
                        +12% this month
                    </div>
                </Link>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-1">Active Students</div>
                    <div className="text-3xl font-bold text-slate-900">4</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sm:col-span-2 lg:col-span-1">
                    <div className="text-slate-500 text-sm font-medium mb-1">Hours Taught</div>
                    <div className="text-3xl font-bold text-slate-900">24h</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Courses */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Active Courses</h2>
                        <Link to="/teacher/schedule" className="text-cyan-700 text-sm font-bold hover:underline">View All</Link>
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
                                                <h3 className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">{booking.topic}</h3>
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
                                                    className="h-full bg-cyan-700 rounded-full transition-all duration-500"
                                                    style={{ width: `${(completedSessions / booking.totalSessions) * 100}%` }}
                                                ></div>
                                            </div>
                                            {nextSession && (
                                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                                    <Clock size={14} className="text-cyan-500" />
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
                        <Link to="/teacher/requests" className="text-cyan-700 text-sm font-bold hover:underline">View All</Link>
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
                                            onClick={() => openRemarkModal(booking.id, 'active')}
                                            className="flex-1 py-2 bg-cyan-700 text-white text-xs font-bold rounded-xl hover:bg-cyan-700 transition-all"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => openRemarkModal(booking.id, 'rejected')}
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

                {/* Refer & Earn Card */}
                <div className="bg-gradient-to-br from-violet-600 to-cyan-700 rounded-3xl p-6 text-white relative overflow-hidden group cursor-pointer" onClick={() => setShowReferralModal(true)}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <Gift size={20} className="text-white" />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Refer & Earn Bonus</h4>
                        <p className="text-cyan-100 text-sm mb-4">Invite other teachers to Teacher Dekho and earn a joining bonus.</p>
                        <button className="px-4 py-2 bg-white text-cyan-700 font-bold rounded-lg text-xs hover:bg-cyan-50 transition-colors">
                            Invite Teachers
                        </button>
                    </div>
                </div>
            </div>

            {/* Referral Modal */}
            <ReferralModal
                isOpen={showReferralModal}
                onClose={() => setShowReferralModal(false)}
                userRole="teacher"
                userName={user?.displayName || "Teacher"}
            />

            {/* Remark Modal */}
            {remarkModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900">
                                {remarkModal.action === 'active' ? 'Approve Request' : 'Decline Request'}
                            </h3>
                            <button onClick={() => setRemarkModal({ isOpen: false, bookingId: null, action: null })} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <p className="text-slate-500 text-sm mb-4">
                            {remarkModal.action === 'active'
                                ? "Add a note for the student (e.g., 'Looking forward to our class!')."
                                : "Please provide a reason for declining this request."}
                        </p>

                        <textarea
                            value={remarkText}
                            onChange={(e) => setRemarkText(e.target.value)}
                            placeholder="Write your remark here..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-32 mb-6"
                        ></textarea>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setRemarkModal({ isOpen: false, bookingId: null, action: null })}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={processing || (remarkModal.action === 'rejected' && !remarkText.trim())}
                                className={`flex-1 py-3 font-bold rounded-xl text-white transition-colors ${remarkModal.action === 'active' ? 'bg-cyan-700 hover:bg-cyan-800' : 'bg-red-600 hover:bg-red-700'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {processing ? 'Processing...' : (remarkModal.action === 'active' ? 'Approve' : 'Decline')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
