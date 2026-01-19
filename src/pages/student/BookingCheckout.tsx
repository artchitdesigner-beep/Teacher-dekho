import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Shield, Calendar, Clock, CheckCircle2, Wallet } from 'lucide-react';

export default function BookingCheckout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { teacher, paymentMode, plan, date, slot, courseTopic, courseDescription, members } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!location.state) {
            navigate('/student/search');
        }
    }, [location.state, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setSuccess(true);
        // In a real app, you would verify payment and create the booking in Firestore here
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl text-center max-w-md w-full animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Booking Confirmed!</h1>
                    <p className="text-slate-500 mb-8">Your session with {teacher?.name} has been successfully scheduled.</p>
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="w-full py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!teacher) return null;

    const bookingDate = new Date(date);

    // Calculations
    const basePrice = paymentMode === 'monthly' ? plan.priceMonthly : plan.priceFull;
    const totalStudents = 1 + (members?.length || 0);
    const discountPerMember = 0.05; // 5%
    const totalDiscountPercentage = (members?.length || 0) * discountPerMember;

    const subtotal = basePrice * totalStudents;
    const discountAmount = subtotal * totalDiscountPercentage;
    const finalTotal = subtotal - discountAmount;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div className="font-bold text-lg text-slate-900 dark:text-slate-100">Checkout</div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {/* Teacher Summary */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <img src={teacher.photoURL || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop"} alt="Teacher" className="w-16 h-16 rounded-full object-cover" />
                    <div>
                        <div className="font-bold text-lg text-slate-900 dark:text-slate-100">{teacher.name}</div>
                        <div className="text-sm text-slate-500">{teacher.subject}</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Details View */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Session Details</h2>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Topic / Course</div>
                                <div className="font-medium text-slate-900 dark:text-slate-100 text-lg">{courseTopic}</div>
                                {courseDescription && (
                                    <div className="text-sm text-slate-500 mt-1">{courseDescription}</div>
                                )}
                            </div>

                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Group Members</div>
                                {members && members.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-300 w-full">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 flex items-center justify-center text-xs font-bold">You</div>
                                                <span>(Host)</span>
                                            </div>
                                            <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>
                                        </div>
                                        {members.map((member: { name: string; phone: string }, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-300 w-full">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                                                    <span>{member.name} <span className="text-xs text-slate-400">({member.phone})</span></span>
                                                </div>
                                                <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Pending</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-500 italic">No additional members added.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Order Summary</h2>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-slate-100">{plan.name} Plan</div>
                                    <div className="text-xs text-slate-500">{paymentMode === 'monthly' ? 'Monthly Subscription' : 'Full Course Fee'}</div>
                                </div>
                                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                    ₹{basePrice}
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-2"><Calendar size={16} /> Date</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{bookingDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-2"><Clock size={16} /> Time</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">{slot}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                                    <span>Base Price x {totalStudents} Students</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span>Group Discount ({members.length * 5}%)</span>
                                        <span>-₹{discountAmount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                                    <span className="font-bold text-slate-900 dark:text-slate-100">Total Amount</span>
                                    <span className="font-bold text-2xl text-cyan-700 dark:text-cyan-400">
                                        ₹{finalTotal}
                                    </span>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full py-3.5 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-700/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>Continue without Pay <span className="text-xs font-normal bg-white/20 text-white px-2 py-0.5 rounded-full">Pay Later</span></>
                                        )}
                                    </button>

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full py-3.5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>Pay with Wallet <Wallet size={18} /></>
                                        )}
                                    </button>

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>Pay Now <CreditCard size={18} /></>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <Shield size={12} />
                                    Secure Payment Gateway
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
