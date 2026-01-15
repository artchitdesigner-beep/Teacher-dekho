import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, CreditCard, Shield, BookOpen } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const STEPS = ['Select Plan', 'Schedule', 'Details', 'Payment'];

const PLANS = [
    {
        id: 'silver',
        name: 'Silver',
        classesPerWeek: 2,
        priceMonthly: 2000,
        priceFull: 10000,
        features: ['2 classes/week', 'Basic doubts support', 'Standard notes']
    },
    {
        id: 'gold',
        name: 'Gold',
        classesPerWeek: 3,
        priceMonthly: 3500,
        priceFull: 18000,
        features: ['3 classes/week', 'Priority doubts support', 'Premium notes', 'Weekly tests'],
        popular: true
    },
    {
        id: 'platinum',
        name: 'Platinum',
        classesPerWeek: 5,
        priceMonthly: 5000,
        priceFull: 25000,
        features: ['5 classes/week', '24/7 doubts support', 'All study material', '1-on-1 mentorship']
    }
];

export default function BookingWizard() {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [paymentMode, setPaymentMode] = useState<'monthly' | 'full'>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<string>('gold');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [courseTopic, setCourseTopic] = useState('');
    const [groupMembers, setGroupMembers] = useState('');

    // Schedule State
    const [weekOffset, setWeekOffset] = useState(0);

    useEffect(() => {
        async function fetchTeacher() {
            if (!teacherId) return;
            try {
                const docRef = doc(db, 'users', teacherId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTeacher(docSnap.data());
                }
            } catch (error) {
                console.error('Error fetching teacher:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTeacher();
    }, [teacherId]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate(-1);
        }
    };

    const getDates = () => {
        const dates = [];
        const today = new Date();
        today.setDate(today.getDate() + (weekOffset * 7));

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const dates = getDates();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={handleBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div className="font-bold text-lg text-slate-900 dark:text-slate-100">Book Session</div>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
                {/* Progress Bar */}
                <div className="max-w-3xl mx-auto px-6 pb-4">
                    <div className="flex items-center justify-between mb-2">
                        {STEPS.map((step, index) => (
                            <div key={step} className={`text-xs font-bold ${index <= currentStep ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-400'}`}>
                                {step}
                            </div>
                        ))}
                    </div>
                    <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cyan-700 transition-all duration-300 ease-out"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {/* Step 1: Plan Selection */}
                {currentStep === 0 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Choose your learning plan</h1>
                            <p className="text-slate-500">Select a plan that suits your learning pace.</p>
                        </div>

                        {/* Payment Mode Toggle */}
                        <div className="flex justify-center">
                            <div className="bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 inline-flex">
                                <button
                                    onClick={() => setPaymentMode('monthly')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${paymentMode === 'monthly' ? 'bg-cyan-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                                >
                                    Monthly Pay
                                </button>
                                <button
                                    onClick={() => setPaymentMode('full')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${paymentMode === 'full' ? 'bg-cyan-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                                >
                                    Full Course
                                </button>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid gap-4">
                            {PLANS.map(plan => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`relative bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-cyan-500 bg-cyan-50/30 dark:bg-cyan-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 right-6 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                                            <div className="text-sm text-slate-500">{plan.classesPerWeek} classes per week</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                ₹{paymentMode === 'monthly' ? plan.priceMonthly : plan.priceFull}
                                            </div>
                                            <div className="text-xs text-slate-400">{paymentMode === 'monthly' ? '/month' : 'one-time'}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <Check size={16} className="text-cyan-600" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Schedule Selection */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Schedule your first class</h1>
                            <p className="text-slate-500">Choose a date and time to start your learning journey.</p>
                        </div>

                        {/* Week Navigation */}
                        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                                disabled={weekOffset === 0}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                {dates[0].toLocaleDateString('default', { month: 'long', day: 'numeric' })} - {dates[6].toLocaleDateString('default', { month: 'long', day: 'numeric' })}
                            </span>
                            <button
                                onClick={() => setWeekOffset(prev => prev + 1)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Days & Slots */}
                        <div className="space-y-6">
                            {dates.map((date, index) => (
                                <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                                            <span className="text-xs uppercase">{date.toLocaleDateString('default', { weekday: 'short' })}</span>
                                            <span className="text-lg">{date.getDate()}</span>
                                        </div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">Available Slots</div>
                                    </div>

                                    {/* Mock Slots - In real app, filter by teacher availability */}
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {['09:00 AM', '10:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(time => (
                                            <button
                                                key={time}
                                                onClick={() => {
                                                    setSelectedDate(date);
                                                    setSelectedSlot(time);
                                                }}
                                                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${selectedDate?.toDateString() === date.toDateString() && selectedSlot === time
                                                    ? 'bg-cyan-700 text-white border-cyan-700'
                                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-cyan-300'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Details */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Class Details</h1>
                            <p className="text-slate-500">Tell us a bit more about what you want to learn.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Topic / Course Name</label>
                                <input
                                    type="text"
                                    value={courseTopic}
                                    onChange={(e) => setCourseTopic(e.target.value)}
                                    placeholder="e.g. Class 12 Physics - Thermodynamics"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Group Members (Optional)</label>
                                <textarea
                                    value={groupMembers}
                                    onChange={(e) => setGroupMembers(e.target.value)}
                                    placeholder="Enter names or emails of friends joining you (if any)"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none h-32 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Payment Preview */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Review & Pay</h1>
                            <p className="text-slate-500">Review your booking details before proceeding to payment.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                            {/* Summary Header */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <img src={teacher?.photoURL || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop"} alt="Teacher" className="w-16 h-16 rounded-full object-cover" />
                                <div>
                                    <div className="font-bold text-lg text-slate-900 dark:text-slate-100">{teacher?.name || "Teacher Name"}</div>
                                    <div className="text-sm text-slate-500">{teacher?.subject || "Subject"}</div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                <div className="flex items-start justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <div className="text-sm text-slate-500">Plan</div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{PLANS.find(p => p.id === selectedPlan)?.name} Plan</div>
                                        <div className="text-xs text-cyan-600 font-medium">{paymentMode === 'monthly' ? 'Monthly Subscription' : 'One-time Payment'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-xl text-slate-900 dark:text-slate-100">
                                            ₹{paymentMode === 'monthly'
                                                ? PLANS.find(p => p.id === selectedPlan)?.priceMonthly
                                                : PLANS.find(p => p.id === selectedPlan)?.priceFull}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="text-sm text-slate-500 flex items-center gap-1"><Calendar size={14} /> First Class</div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">
                                            {selectedDate?.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-slate-500 flex items-center gap-1"><Clock size={14} /> Time</div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">{selectedSlot}</div>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <div className="text-sm text-slate-500 flex items-center gap-1"><BookOpen size={14} /> Topic</div>
                                        <div className="font-bold text-slate-900 dark:text-slate-100">{courseTopic}</div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3 text-sm text-blue-700 dark:text-blue-300">
                                    <Shield size={18} className="shrink-0 mt-0.5" />
                                    <p>Your payment is secure. You will be redirected to our payment gateway to complete the transaction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 z-50">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="text-sm">
                        <span className="text-slate-500">Total:</span>
                        <span className="ml-2 font-bold text-xl text-slate-900 dark:text-slate-100">
                            ₹{paymentMode === 'monthly'
                                ? PLANS.find(p => p.id === selectedPlan)?.priceMonthly
                                : PLANS.find(p => p.id === selectedPlan)?.priceFull}
                        </span>
                    </div>
                    <button
                        onClick={currentStep === STEPS.length - 1 ? () => alert('Proceed to Payment Gateway') : handleNext}
                        disabled={
                            (currentStep === 1 && (!selectedDate || !selectedSlot)) ||
                            (currentStep === 2 && !courseTopic)
                        }
                        className="px-8 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-700/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {currentStep === STEPS.length - 1 ? (
                            <>Pay Now <CreditCard size={18} /></>
                        ) : (
                            <>Next Step <ChevronRight size={18} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
