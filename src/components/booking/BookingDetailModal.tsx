import { X, Clock, Users, CreditCard, MessageSquare, ShieldCheck } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface BookingDetailModalProps {
    booking: any;
    onClose: () => void;
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
    if (!booking) return null;

    const scheduledAt = booking.scheduledAt instanceof Timestamp
        ? booking.scheduledAt.toDate()
        : new Date(booking.scheduledAt);

    const statusColors = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
        completed: 'bg-slate-100 text-slate-700 border-slate-200'
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">Booking Details</h3>
                        <div className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusColors[booking.status as keyof typeof statusColors]}`}>
                            {booking.status}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Header Info */}
                    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <div className="w-12 h-12 bg-white text-indigo-600 rounded-xl flex flex-col items-center justify-center text-xs font-bold shadow-sm">
                            <span>{scheduledAt.getDate()}</span>
                            <span className="uppercase text-[10px]">{scheduledAt.toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div>
                            <div className="font-bold text-indigo-900">{booking.topic}</div>
                            <div className="text-sm text-indigo-700 flex items-center gap-2">
                                <Clock size={14} />
                                {scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Users size={16} className="text-indigo-600" />
                            Group Members
                        </h4>
                        <div className="grid gap-2">
                            {booking.members && booking.members.length > 0 ? (
                                booking.members.map((member: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="text-sm font-medium text-slate-700">{member.name}</div>
                                        <div className="text-xs text-slate-500">{member.phone}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    No additional members added.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard size={16} className="text-indigo-600" />
                            Payment Status
                        </h4>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                            <ShieldCheck size={18} className="text-emerald-600 mt-0.5" />
                            <div>
                                <div className="text-sm font-bold text-emerald-900">
                                    {booking.isDemo ? 'Trial Class - Pay After' : 'Regular Class'}
                                </div>
                                <p className="text-xs text-emerald-700 mt-0.5">
                                    {booking.isDemo
                                        ? "This is a trial session. You only need to pay if you're satisfied with the class."
                                        : "Payment for this regular session is handled as per your agreement with the teacher."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Remarks */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare size={16} className="text-indigo-600" />
                            Teacher's Message
                        </h4>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            {booking.teacherRemarks ? (
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "{booking.teacherRemarks}"
                                </p>
                            ) : (
                                <p className="text-sm text-slate-400 italic">
                                    No message from the teacher yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
