import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import {
    Calendar, Clock, Video, CreditCard,
    Users, AlertCircle, ChevronLeft, Trash2,
    Plus, X, ExternalLink
} from 'lucide-react';

interface Member {
    name: string;
    phone: string;
}

interface Booking {
    id: string;
    teacherId: string;
    studentId: string;
    studentName: string;
    topic: string;
    description?: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
    members?: Member[];
    teacherRemarks?: string;
    paymentStatus?: 'pending' | 'paid' | 'failed';
    createdAt: Timestamp;
}

export default function BookingDetail() {
    const { id: bookingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMember, setNewMember] = useState({ name: '', phone: '' });
    const [isAddingMember, setIsAddingMember] = useState(false);

    useEffect(() => {
        async function fetchBooking() {
            if (!bookingId || !user) return;
            try {
                const docRef = doc(db, 'bookings', bookingId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Booking;
                    // Security check: ensure the user is either the student or the teacher
                    if (data.studentId !== user.uid && data.teacherId !== user.uid) {
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

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking || !newMember.name || !newMember.phone) return;

        try {
            const updatedMembers = [...(booking.members || []), newMember];
            const docRef = doc(db, 'bookings', booking.id);
            await updateDoc(docRef, { members: updatedMembers });

            setBooking({ ...booking, members: updatedMembers });
            setNewMember({ name: '', phone: '' });
            setIsAddingMember(false);
        } catch (err) {
            console.error("Error adding member:", err);
            alert("Failed to add member.");
        }
    };

    const handleRemoveMember = async (index: number) => {
        if (!booking || !booking.members) return;

        try {
            const updatedMembers = booking.members.filter((_, i) => i !== index);
            const docRef = doc(db, 'bookings', booking.id);
            await updateDoc(docRef, { members: updatedMembers });

            setBooking({ ...booking, members: updatedMembers });
        } catch (err) {
            console.error("Error removing member:", err);
            alert("Failed to remove member.");
        }
    };

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

    const isUpcoming = booking.scheduledAt.toMillis() > Date.now();
    const canJoin = booking.status === 'confirmed' && isUpcoming;

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
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
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
                                {booking.isDemo ? 'Demo Class' : 'Regular Class'}
                            </span>
                            <span className="hidden md:inline text-slate-300">|</span>
                            <span className="text-slate-500 text-xs md:text-sm flex items-center gap-1">
                                <Calendar size={14} />
                                Booked on {booking.createdAt.toDate().toLocaleDateString()}
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
                                onClick={() => alert("Rescheduling coming soon!")}
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-indigo-200 hover:text-indigo-600 transition-all text-sm"
                            >
                                Reschedule
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
                    {/* Schedule Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Clock className="text-indigo-600" size={20} />
                            Class Schedule
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                    <Calendar size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] md:text-xs text-slate-400 font-medium uppercase">Date</div>
                                    <div className="text-sm md:text-base font-bold text-slate-900">{booking.scheduledAt.toDate().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                                    <Clock size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] md:text-xs text-slate-400 font-medium uppercase">Time</div>
                                    <div className="text-sm md:text-base font-bold text-slate-900">{booking.scheduledAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Members Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Users className="text-indigo-600" size={20} />
                                Group Members
                            </h3>
                            <button
                                onClick={() => setIsAddingMember(!isAddingMember)}
                                className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Add
                            </button>
                        </div>

                        {isAddingMember && (
                            <form onSubmit={handleAddMember} className="mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <input
                                        required
                                        placeholder="Name"
                                        value={newMember.name}
                                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                        className="p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                    <input
                                        required
                                        placeholder="Phone Number"
                                        value={newMember.phone}
                                        onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                        className="p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingMember(false)}
                                        className="px-4 py-2 text-slate-500 text-sm font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        )}

                        {!booking.members || booking.members.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm">No additional members added.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {booking.members.map((member, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-100 shrink-0">
                                                {member.name[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 truncate">{member.name}</div>
                                                <div className="text-xs text-slate-500">{member.phone}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMember(idx)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {booking.paymentStatus || 'pending'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 text-sm">Amount</span>
                                <span className="font-bold text-slate-900">₹{booking.isDemo ? '0 (Demo)' : '500'}</span>
                            </div>

                            {booking.paymentStatus !== 'paid' && !booking.isDemo && (
                                <button
                                    onClick={handlePayment}
                                    className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    Pay Now
                                </button>
                            )}

                            {booking.isDemo && (
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <p className="text-[11px] md:text-xs text-indigo-700 leading-relaxed">
                                        <strong>Note:</strong> This is a demo class. Payment is only required if you choose to continue with regular classes.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Teacher Remarks Card */}
                    {booking.teacherRemarks && (
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <MessageSquare className="text-indigo-600" size={20} />
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
