import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import {
    Clock, AlertCircle,
    Video, Info, User,
    ExternalLink, ChevronLeft, Trash2, CreditCard,
    Crown, Zap, Star
} from 'lucide-react';

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
    studentName: string;
    topic: string;
    description?: string;
    totalSessions: number;
    sessions: Session[];
    status: 'active' | 'pending' | 'completed' | 'rejected';
    paymentStatus: 'pending' | 'paid' | 'required';
    teacherRemarks?: string;
    members?: { name: string; phone: string }[];
    createdAt: Timestamp;
}

export default function BookingDetail() {
    const { id: bookingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [batch, setBatch] = useState<any>(null);

    useEffect(() => {
        async function fetchBooking() {
            if (!bookingId || !user) return;
            try {
                const docRef = doc(db, 'bookings', bookingId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Booking;
                    if (data.studentId !== user.uid && data.teacherId !== user.uid) {
                        setError("You don't have permission to view this course.");
                    } else {
                        setBooking({ ...data, id: docSnap.id });

                        // Fetch batch details if batchId exists
                        if ((data as any).batchId) {
                            const batchRef = doc(db, 'batches', (data as any).batchId);
                            const batchSnap = await getDoc(batchRef);
                            if (batchSnap.exists()) {
                                setBatch(batchSnap.data());
                            }
                        }
                    }
                } else {
                    setError("Course not found.");
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Failed to load course details.");
            } finally {
                setLoading(false);
            }
        }

        fetchBooking();
    }, [bookingId, user]);

    const handleCancelBooking = async () => {
        if (!booking) return;
        if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;

        try {
            const docRef = doc(db, 'bookings', booking.id);
            await updateDoc(docRef, { status: 'rejected', teacherRemarks: 'Cancelled by student' });
            setBooking({ ...booking, status: 'rejected' });
            alert("Booking cancelled successfully.");
        } catch (err) {
            console.error("Error cancelling booking:", err);
            alert("Failed to cancel booking.");
        }
    };

    const handlePayment = async () => {
        if (!booking) return;
        // Mock payment process
        try {
            const docRef = doc(db, 'bookings', booking.id);
            await updateDoc(docRef, { paymentStatus: 'paid' });
            setBooking({ ...booking, paymentStatus: 'paid' });
            alert("Payment successful! (Mock)");
        } catch (err) {
            console.error("Error processing payment:", err);
            alert("Payment failed.");
        }
    };

    const getNextSession = () => {
        if (!booking?.sessions) return null;
        const now = Date.now();
        return booking.sessions
            .filter(s => s.status === 'confirmed' && s.scheduledAt.toMillis() > now)
            .sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis())[0];
    };

    const nextSession = getNextSession();
    const firstSessionCompleted = booking?.sessions?.some(s => s.isDemo && s.status === 'completed');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-3xl border border-slate-100 text-center">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
                <p className="text-slate-500 mb-6">{error || "Something went wrong."}</p>
                <button
                    onClick={() => navigate('/student/courses')}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const canJoin = nextSession && booking.status === 'active';

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Navigation & Status */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/student/courses')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back to Courses
                </button>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    {booking.status}
                </div>
            </div>

            {/* Main Header Card */}
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-lg">
                                {booking.totalSessions} Sessions Course
                            </span>
                            {/* Plan Badge */}
                            {(booking as any).planType && (
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1
                                    ${(booking as any).planType === 'platinum' ? 'bg-indigo-100 text-indigo-700' :
                                        (booking as any).planType === 'gold' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-600'}`}>
                                    {(booking as any).planType === 'platinum' && <Crown size={12} />}
                                    {(booking as any).planType === 'gold' && <Zap size={12} />}
                                    {(booking as any).planType === 'silver' && <Star size={12} />}
                                    {(booking as any).planType} Plan
                                </span>
                            )}
                            <span className="hidden md:inline text-slate-300">|</span>
                            <span className="text-slate-500 text-xs md:text-sm flex items-center gap-1">
                                <User size={14} /> {booking.teacherName}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
                            {booking.topic}
                        </h1>
                        {booking.description && (
                            <p className="text-slate-500 text-base md:text-lg max-w-2xl">{booking.description}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        {canJoin ? (
                            <button className="w-full py-3.5 md:py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                                <Video size={20} />
                                Join Class Now
                            </button>
                        ) : (
                            <button disabled className="w-full py-3.5 md:py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed flex items-center justify-center gap-2">
                                <Video size={20} />
                                Join Class
                            </button>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={() => alert("Change Plan feature coming soon!")}
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-indigo-200 hover:text-indigo-600 transition-all text-sm"
                            >
                                Change Plan
                            </button>
                            {booking.status !== 'rejected' && (
                                <button
                                    onClick={handleCancelBooking}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Sessions List Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Clock className="text-indigo-600" size={20} />
                            Course Sessions
                        </h3>
                        <div className="space-y-4">
                            {booking.sessions?.map((session, idx) => (
                                <div key={session.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${session.id === nextSession?.id ? 'bg-indigo-50 border-indigo-100 ring-1 ring-indigo-50' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${session.id === nextSession?.id ? 'bg-white text-indigo-600 shadow-sm' : 'bg-white text-slate-400'}`}>
                                            <span className="text-sm">{session.scheduledAt.toDate().getDate()}</span>
                                            <span className="text-[8px] uppercase">{session.scheduledAt.toDate().toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-bold text-slate-900">Session {idx + 1}</span>
                                                {session.isDemo && <span className="text-[8px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase">Demo</span>}
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                                <Clock size={12} /> {session.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${session.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                            session.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {session.status}
                                        </span>
                                        {session.id === nextSession?.id && (
                                            <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                                                <Video size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Group Members */}
                    {booking.members && booking.members.length > 0 && (
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <User className="text-indigo-600" size={20} />
                                Group Members
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {booking.members.map((member, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="font-bold text-slate-900">{member.name}</div>
                                        <div className="text-xs text-slate-500">{member.phone}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Course Info Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Info className="text-indigo-600" size={20} />
                            Course Information
                        </h3>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>This course covers <strong>{booking.topic}</strong> with <strong>{booking.teacherName}</strong>.</p>

                            {batch && (
                                <>
                                    <div className="mt-8">
                                        <h4 className="font-bold text-slate-900 mb-4">Curriculum</h4>
                                        <div className="space-y-3">
                                            {batch.syllabus?.map((module: any, i: number) => (
                                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="font-bold text-slate-800 text-xs mb-2">{module.title}</div>
                                                    <div className="space-y-1">
                                                        {module.lessons.map((lesson: string, li: number) => (
                                                            <div key={li} className="text-[10px] flex items-center gap-2">
                                                                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                                                {lesson}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="font-bold text-slate-900 mb-4">Weekly Schedule</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {batch.schedule?.map((item: any, i: number) => (
                                                <div key={i} className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-[10px]">
                                                    <div className="font-bold text-indigo-700">{item.day}</div>
                                                    <div className="text-indigo-600">{item.time}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs mt-6">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <AlertCircle size={14} />
                                    Payment Policy
                                </div>
                                The first session is a Demo. Payment for the entire course is required after the demo session is completed to continue with the rest of the classes.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment & Teacher */}
                <div className="space-y-8">
                    {/* Payment Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <CreditCard className="text-indigo-600" size={20} />
                            Payment Details
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 text-sm">Status</span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                    booking.paymentStatus === 'required' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {booking.paymentStatus || 'pending'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 text-sm">Course Fee</span>
                                <span className="font-bold text-slate-900">₹{booking.totalSessions * 500}</span>
                            </div>

                            {booking.paymentStatus === 'required' && (
                                <button
                                    onClick={handlePayment}
                                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    Pay Course Fee
                                </button>
                            )}

                            {booking.paymentStatus === 'pending' && !firstSessionCompleted && (
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <p className="text-[11px] md:text-xs text-indigo-700 leading-relaxed">
                                        <strong>Note:</strong> The first session is a demo. Payment is required after the demo to continue the course.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Teacher Remarks Card */}
                    {booking.teacherRemarks && (
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <MessageSquare size={20} className="text-indigo-600" />
                                Teacher's Remarks
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-2xl italic text-slate-600 text-sm">
                                "{booking.teacherRemarks}"
                            </div>
                        </div>
                    )}

                    {/* Help Card */}
                    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl shadow-slate-200">
                        <h3 className="font-bold mb-2">Need Help?</h3>
                        <p className="text-slate-400 text-sm mb-6">If you're having trouble joining or need to contact support.</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2">
                            Contact Support
                            <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MessageSquare({ className, size }: { className?: string, size?: number }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
}
