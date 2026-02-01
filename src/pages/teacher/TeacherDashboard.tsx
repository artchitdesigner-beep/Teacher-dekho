import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, getDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import {
    Clock,
    AlertCircle,
    Info,
    ArrowRight,
    UploadCloud,
    Users,
    TrendingUp,
    Star,
    LayoutDashboard,
    PenTool
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReferralModal from '@/components/common/ReferralModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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
    scheduledAt?: Timestamp;
    teacherRemark?: string;
}

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [upcomingClasses, setUpcomingClasses] = useState<Booking[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [profileStatus, setProfileStatus] = useState({ kycStatus: 'pending', hasBankInfo: false });
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Get current week dates
    const getWeekDates = (date: Date) => {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };
    const weekDates = getWeekDates(new Date());

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

                // Fetch Profile Status
                const profileRef = doc(db, 'users', user.uid);
                const profileSnap = await getDoc(profileRef);
                if (profileSnap.exists()) {
                    const data = profileSnap.data();
                    setProfileStatus({
                        kycStatus: data.kycStatus || 'pending',
                        hasBankInfo: !!(data.bankName && data.accountNumber && data.ifsc)
                    });
                }

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
        <div className="space-y-12 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-200 dark:shadow-none">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-slate-100 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 font-medium">Welcome back, {user?.displayName} ✨</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/teacher/batches" className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <PenTool size={18} className="text-cyan-600" /> Create Batch
                    </Link>
                </div>
            </div>

            {/* 1. Active Courses - High Impact Section (Now First) */}
            <section className="relative">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                            Active <span className="text-cyan-600">Courses</span>
                            {upcomingClasses.length > 0 && (
                                <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-[10px] font-black rounded-full uppercase tracking-tighter">
                                    {upcomingClasses.length} Running
                                </span>
                            )}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Manage your ongoing learning sessions and student progress.</p>
                    </div>
                    <Link to="/teacher/batches" className="text-sm font-black text-cyan-600 hover:text-cyan-700 uppercase tracking-widest border-b-2 border-cyan-100 hover:border-cyan-600 transition-all pb-0.5">View Schedule</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingClasses.length === 0 ? (
                        <div className="md:col-span-2 lg:col-span-3 p-12 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 text-center">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Info size={32} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">No Active Courses</h3>
                            <p className="text-slate-400 text-sm">Once you approve a request, it will appear here.</p>
                        </div>
                    ) : (
                        upcomingClasses.map((booking, idx) => {
                            const completedSessions = booking.sessions?.filter(s => s.status === 'completed').length || 0;

                            // Improve detection: check sessions array first, fallback to scheduledAt for first session/demo
                            let nextSession = booking.sessions?.find(s =>
                                (s.status === 'confirmed' || s.status === 'pending') &&
                                s.scheduledAt.toMillis() > Date.now()
                            );

                            if (!nextSession && booking.scheduledAt && booking.scheduledAt.toMillis() > Date.now()) {
                                nextSession = {
                                    scheduledAt: booking.scheduledAt,
                                    id: 'initial',
                                    status: 'confirmed',
                                    isDemo: true
                                } as any;
                            }
                            const colors = [
                                'from-indigo-50 to-blue-50 border-indigo-100/50 text-indigo-700',
                                'from-emerald-50 to-teal-50 border-emerald-100/50 text-emerald-700',
                                'from-rose-50 to-pink-50 border-rose-100/50 text-rose-700',
                                'from-amber-50 to-orange-50 border-amber-100/50 text-amber-700'
                            ];
                            const colorClass = colors[idx % colors.length];

                            return (
                                <Card key={booking.id} className={`group relative overflow-hidden rounded-[2rem] border-none bg-gradient-to-br ${colorClass} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]`}>
                                    <Link to={`/teacher/bookings/${booking.id}`} className="block p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="font-black text-xl text-slate-900 tracking-tight mb-1 group-hover:text-cyan-700 transition-colors line-clamp-1">{booking.topic}</h3>
                                                <div className="flex items-center gap-1.5 font-bold text-xs opacity-70">
                                                    <Users size={14} /> {booking.studentName}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-white/60 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest border-none shadow-sm">
                                                {booking.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-tighter opacity-60">
                                                    <span>Progress</span>
                                                    <span>{completedSessions}/{booking.totalSessions} Sessions</span>
                                                </div>
                                                <div className="h-2 bg-white/50 rounded-full overflow-hidden border border-white/20">
                                                    <div
                                                        className="h-full bg-slate-900 rounded-full transition-all duration-1000"
                                                        style={{ width: `${(completedSessions / booking.totalSessions) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {nextSession && (
                                                <div className="flex items-center gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-inner">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                                        <Clock size={16} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-[10px] font-black uppercase tracking-tighter opacity-50">Next Session</div>
                                                        <div className="text-xs font-bold text-slate-800 truncate">
                                                            {nextSession.scheduledAt.toDate().toLocaleDateString([], { day: 'numeric', month: 'short' })} at {nextSession.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </Card>
                            );
                        })
                    )}
                </div>
            </section>

            {/* 2. Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/teacher/wallet">
                    <Card className="group bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200 dark:shadow-none hover:scale-[1.03] transition-all cursor-pointer relative overflow-hidden border-none text-left">
                        <div className="relative z-10">
                            <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Earnings</div>
                            <div className="text-4xl font-black tracking-tighter italic">₹12,500</div>
                            <div className="mt-4">
                                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-none font-bold text-[10px] px-3 py-1 rounded-full">
                                    <TrendingUp size={12} className="mr-1.5" /> +12% this month
                                </Badge>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Card className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center text-left">
                    <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Active Students</div>
                    <div className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">04</div>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-600 font-black uppercase tracking-tighter">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Growth Stage
                    </div>
                </Card>

                <Card className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center text-left">
                    <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Hours Taught</div>
                    <div className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">24<span className="text-xl ml-1 opacity-40 italic">h</span></div>
                    <div className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Lifetime Impact</div>
                </Card>

                <Card className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center text-left">
                    <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Average Rating</div>
                    <div className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter flex items-center gap-2">
                        4.9 <Star size={24} className="fill-amber-400 text-amber-400" />
                    </div>
                    <div className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Top 5% Educator</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Alerts */}
                    <section className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-rose-100 dark:bg-rose-900/40 rounded-xl text-rose-600 dark:text-rose-400">
                                <AlertCircle size={22} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pending Actions</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileStatus.kycStatus !== 'verified' && (
                                <Link to="/teacher/profile" className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 group hover:ring-2 hover:ring-rose-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600">
                                            <UploadCloud size={18} />
                                        </div>
                                        <div>
                                            <div className="font-black text-sm text-slate-900 dark:text-slate-100">Complete KYC</div>
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Unverified Profile</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={18} className="text-rose-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                            {!profileStatus.hasBankInfo && (
                                <Link to="/teacher/profile" className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 group hover:ring-2 hover:ring-rose-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600">
                                            <Info size={18} />
                                        </div>
                                        <div>
                                            <div className="font-black text-sm text-slate-900 dark:text-slate-100">Add Bank Info</div>
                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Payment Setup</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={18} className="text-indigo-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </section>

                    {/* New Requests */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">New <span className="text-cyan-600">Requests</span></h2>
                            <Button variant="link" asChild className="text-sm font-black text-slate-400 hover:text-cyan-600 uppercase tracking-widest h-auto p-0">
                                <Link to="/teacher/requests">See All</Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pendingRequests.length === 0 ? (
                                <Card className="md:col-span-2 p-10 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-dashed text-center">
                                    <p className="text-slate-400 font-medium">No new requests at the moment.</p>
                                </Card>
                            ) : (
                                pendingRequests.map(booking => (
                                    <Card key={booking.id} className="p-6 rounded-3xl border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all text-left">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mb-1">New Booking Request</div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">{booking.topic}</h3>
                                                <p className="text-xs text-slate-500 font-medium font-mono mt-1">ID: #{booking.id.slice(0, 8)}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                                                <span className="text-[8px] font-black uppercase">Sessions</span>
                                                <span className="text-lg font-black leading-none">{booking.totalSessions}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => openRemarkModal(booking.id, 'active')}
                                                className="flex-1 bg-cyan-700 hover:bg-slate-900 text-white font-black rounded-xl h-12 shadow-lg shadow-cyan-200 dark:shadow-none"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => openRemarkModal(booking.id, 'rejected')}
                                                className="flex-1 rounded-xl h-12 border-slate-200 text-slate-500 font-black hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100"
                                            >
                                                Decline
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <aside className="space-y-10">
                    {/* Schedule */}
                    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 p-8 shadow-sm text-left">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Schedule</h2>
                            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-1">
                                {selectedDate.toLocaleString('default', { month: 'short' })}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5 mb-8">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className="text-center text-[10px] font-black text-slate-300 uppercase">{day}</div>
                            ))}
                            {weekDates.map((date, i) => {
                                const isSelected = selectedDate.toDateString() === date.toDateString();
                                const isToday = new Date().toDateString() === date.toDateString();
                                const hasClasses = upcomingClasses.some(b =>
                                    b.sessions?.some(s => s.scheduledAt.toDate().toDateString() === date.toDateString())
                                );

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(date)}
                                        className={`
                                            flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all relative
                                            ${isSelected ? 'bg-slate-900 text-white shadow-xl' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}
                                            ${isToday && !isSelected ? 'ring-2 ring-cyan-500 ring-inset' : ''}
                                        `}
                                    >
                                        <span className="text-xs font-black leading-none">{date.getDate()}</span>
                                        {hasClasses && (
                                            <div className={`w-1 h-1 rounded-full mt-1.5 ${isSelected ? 'bg-cyan-400' : 'bg-cyan-600'}`}></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</h3>
                            {(() => {
                                const dayClasses = upcomingClasses.flatMap(b =>
                                    (b.sessions || [])
                                        .filter(s => s.scheduledAt.toDate().toDateString() === selectedDate.toDateString())
                                        .map(s => ({ ...s, topic: b.topic, studentName: b.studentName }))
                                );

                                if (dayClasses.length === 0) {
                                    return (
                                        <div className="text-center py-8">
                                            <p className="text-xs text-slate-400 italic font-medium">Free day! No sessions.</p>
                                        </div>
                                    );
                                }

                                return dayClasses.map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-cyan-200 transition-all cursor-pointer">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-900 dark:text-white text-xs font-black shadow-sm group-hover:bg-cyan-600 group-hover:text-white transition-all">
                                            {s.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-black text-slate-900 dark:text-slate-100 truncate tracking-tight">{s.topic}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate mt-0.5">{s.studentName}</div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </Card>

                    {/* Refer & Earn */}
                    <Card className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border-none text-left">
                        <div className="relative z-10">
                            <h4 className="font-black text-xl mb-2 tracking-tight">Refer & Earn</h4>
                            <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-6 opacity-80">Invite fellow teachers and earn exclusive joining bonuses.</p>
                            <Button
                                onClick={() => setShowReferralModal(true)}
                                className="w-full h-12 bg-white text-indigo-900 font-black rounded-xl text-xs hover:bg-slate-100 shadow-lg"
                            >
                                Invite Teachers
                            </Button>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                    </Card>
                </aside>
            </div>

            {/* Remark Modal */}
            <Dialog
                open={remarkModal.isOpen}
                onOpenChange={(open) => !open && setRemarkModal({ isOpen: false, bookingId: null, action: null })}
            >
                <DialogContent className="sm:max-w-md rounded-[2rem] p-8 border-none overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                            {remarkModal.action === 'active' ? 'Approve Request' : 'Decline Request'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            {remarkModal.action === 'active'
                                ? "Add a note for the student (e.g., 'Looking forward to our class!')."
                                : "Please provide a reason for declining this request."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-6">
                        <textarea
                            value={remarkText}
                            onChange={(e) => setRemarkText(e.target.value)}
                            placeholder="Write your remark here..."
                            className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-cyan-500/10 outline-none resize-none h-40 font-medium text-slate-700 transition-all"
                        ></textarea>
                    </div>

                    <DialogFooter className="gap-3 sm:space-x-0">
                        <Button
                            variant="ghost"
                            onClick={() => setRemarkModal({ isOpen: false, bookingId: null, action: null })}
                            className="flex-1 h-12 rounded-xl text-slate-400 font-black tracking-widest uppercase text-[10px] hover:text-slate-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStatusUpdate}
                            disabled={processing || (remarkModal.action === 'rejected' && !remarkText.trim())}
                            className={`flex-1 h-12 rounded-xl font-black tracking-widest uppercase text-[10px] transition-all ${remarkModal.action === 'active'
                                ? 'bg-cyan-700 hover:bg-slate-900 text-white'
                                : 'bg-rose-600 hover:bg-slate-900 text-white'
                                }`}
                        >
                            {processing ? 'Processing...' : (remarkModal.action === 'active' ? 'Approve' : 'Decline')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Referral Modal */}
            <ReferralModal
                isOpen={showReferralModal}
                onClose={() => setShowReferralModal(false)}
                userRole="teacher"
                userName={user?.displayName || "Teacher"}
            />
        </div>
    );
}
