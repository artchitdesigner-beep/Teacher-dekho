import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp, collection, addDoc } from 'firebase/firestore';
import {
    Clock, CheckCircle, AlertCircle,
    Video, Info, User, Plus,
    ExternalLink, ChevronLeft, MessageSquare, X
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

export default function TeacherBookingDetail() {
    const { id: bookingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddSession, setShowAddSession] = useState(false);
    const [newSessionData, setNewSessionData] = useState({ date: '', time: '' });
    const [addingSession, setAddingSession] = useState(false);

    useEffect(() => {
        async function fetchBooking() {
            if (!bookingId || !user) return;
            try {
                const docRef = doc(db, 'bookings', bookingId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Booking;
                    if (data.teacherId !== user.uid) {
                        setError("You don't have permission to view this booking.");
                    } else {
                        setBooking({ ...data, id: docSnap.id });
                    }
                } else {
                    setError("Booking not found.");
                }
            } catch (err) {
                console.error("Error fetching booking:", err);
                setError("Failed to load booking details.");
            } finally {
                setLoading(false);
            }
        }

        fetchBooking();
    }, [bookingId, user]);

    const markSessionCompleted = async (sessionId: string) => {
        if (!booking) return;

        try {
            const updatedSessions = booking.sessions.map(s =>
                s.id === sessionId ? { ...s, status: 'completed' as const } : s
            );

            const isFirstDemo = booking.sessions.find(s => s.id === sessionId)?.isDemo;
            const updates: any = { sessions: updatedSessions };

            // If first demo is completed, set paymentStatus to 'required'
            if (isFirstDemo && booking.paymentStatus === 'pending') {
                updates.paymentStatus = 'required';

                // Create notification for student
                await addDoc(collection(db, 'notifications'), {
                    userId: booking.studentId,
                    title: 'Payment Required',
                    message: `Your demo for "${booking.topic}" is completed. Please pay the course fee to continue.`,
                    type: 'info',
                    read: false,
                    createdAt: Timestamp.now(),
                    link: `/student/bookings/${booking.id}`
                });
            }

            await updateDoc(doc(db, 'bookings', booking.id), updates);
            setBooking({ ...booking, ...updates });
            alert("Session marked as completed!");
        } catch (err) {
            console.error("Error updating session:", err);
            alert("Failed to update session.");
        }
    };

    const handleAddSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking) return;
        setAddingSession(true);

        try {
            const scheduledAt = new Date(`${newSessionData.date}T${newSessionData.time}`);
            const newSession: Session = {
                id: Math.random().toString(36).substr(2, 9),
                scheduledAt: Timestamp.fromDate(scheduledAt),
                status: 'confirmed',
                isDemo: false
            };

            const updatedSessions = [...(booking.sessions || []), newSession];
            const updates = {
                sessions: updatedSessions,
                totalSessions: (booking.totalSessions || 0) + 1
            };

            await updateDoc(doc(db, 'bookings', booking.id), updates);
            setBooking({ ...booking, ...updates });
            setShowAddSession(false);
            setNewSessionData({ date: '', time: '' });
            alert("New session added successfully!");
        } catch (err) {
            console.error("Error adding session:", err);
            alert("Failed to add session.");
        } finally {
            setAddingSession(false);
        }
    };

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
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Navigation & Status */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back to Dashboard
                </button>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                    }`}>
                    {booking.status}
                </div>
            </div>

            {/* Main Header Card */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-lg">
                            {booking.totalSessions} Sessions Course
                        </span>
                        <span className="hidden md:inline text-slate-300">|</span>
                        <span className="text-slate-500 text-xs md:text-sm flex items-center gap-1">
                            <User size={14} /> Student: {booking.studentName}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-4">
                        {booking.topic}
                    </h1>
                    {booking.description && (
                        <p className="text-slate-500 text-base md:text-lg max-w-2xl">{booking.description}</p>
                    )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Sessions List */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="text-indigo-600" size={20} />
                                Course Sessions
                            </h3>
                            <button
                                onClick={() => setShowAddSession(true)}
                                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus size={14} /> Add Session
                            </button>
                        </div>
                        <div className="space-y-4">
                            {booking.sessions?.map((session, idx) => (
                                <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex flex-col items-center justify-center font-bold text-slate-400 border border-slate-100">
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
                                        {session.status === 'completed' ? (
                                            <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase bg-emerald-50 px-2 py-1 rounded-lg">
                                                <CheckCircle size={12} /> Completed
                                            </span>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                                                    <Video size={16} />
                                                </button>
                                                <button
                                                    onClick={() => markSessionCompleted(session.id)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all"
                                                >
                                                    Mark Done
                                                </button>
                                            </div>
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
                </div>

                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Info className="text-indigo-600" size={20} />
                            Course Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Payment</span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                    booking.paymentStatus === 'required' ? 'bg-red-100 text-red-700 animate-pulse' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                    {booking.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Progress</span>
                                <span className="font-bold text-slate-900">
                                    {booking.sessions.filter(s => s.status === 'completed').length}/{booking.totalSessions}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
                        <h3 className="font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                                <MessageSquare size={16} /> Message Student
                            </button>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                                <ExternalLink size={16} /> View Student Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Session Modal */}
            {showAddSession && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900">Add New Session</h3>
                            <button onClick={() => setShowAddSession(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSession} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input
                                    required
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={newSessionData.date}
                                    onChange={e => setNewSessionData({ ...newSessionData, date: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map(slot => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setNewSessionData({ ...newSessionData, time: slot })}
                                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${newSessionData.time === slot
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={addingSession || !newSessionData.date || !newSessionData.time}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                {addingSession ? 'Adding...' : 'Add Session'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
