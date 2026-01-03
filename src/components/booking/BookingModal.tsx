import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { X, Loader2, Calendar, Check, Zap, Crown, Star } from 'lucide-react';

interface Teacher {
    uid: string;
    name: string;
    subject: string;
    hourlyRate: number;
}

interface BookingModalProps {
    teacher: Teacher;
    studentId: string;
    studentName: string;
    onClose: () => void;
    onSuccess: () => void;
    initialDate?: string;
    initialTime?: string;
}

type PlanType = 'silver' | 'gold' | 'platinum';

interface Plan {
    id: PlanType;
    name: string;
    sessions: number;
    daysPerWeek: string;
    icon: any;
    color: string;
    features: string[];
}

export default function BookingModal({
    teacher,
    studentId,
    studentName,
    onClose,
    onSuccess,
    initialDate = '',
    initialTime = ''
}: BookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('gold');

    const [formData, setFormData] = useState({
        topic: '',
        date: initialDate,
        time: initialTime,
        description: '',
    });

    const plans: Plan[] = [
        {
            id: 'silver',
            name: 'Silver Plan',
            sessions: 12,
            daysPerWeek: '3 Days/Week',
            icon: Star,
            color: 'bg-slate-100 text-slate-600',
            features: ['12 Sessions/Month', 'Flexible Schedule', 'Basic Support']
        },
        {
            id: 'gold',
            name: 'Gold Plan',
            sessions: 24,
            daysPerWeek: '6 Days/Week',
            icon: Zap,
            color: 'bg-amber-100 text-amber-600',
            features: ['24 Sessions/Month', 'Priority Scheduling', 'Doubt Solving']
        },
        {
            id: 'platinum',
            name: 'Platinum Plan',
            sessions: 30,
            daysPerWeek: 'Daily (7 Days)',
            icon: Crown,
            color: 'bg-indigo-100 text-indigo-600',
            features: ['30 Sessions/Month', 'Dedicated Mentor', '24/7 Support']
        }
    ];

    const currentPlan = plans.find(p => p.id === selectedPlan)!;
    const price = (teacher.hourlyRate || 500) * currentPlan.sessions;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time
            const scheduledAt = new Date(`${formData.date}T${formData.time}`);

            const bookingData = {
                teacherId: teacher.uid || (teacher as any).id,
                studentId: studentId,
                studentName: studentName,
                topic: formData.topic,
                description: formData.description,
                scheduledAt: Timestamp.fromDate(scheduledAt),
                status: 'pending',
                isDemo: true, // First class is demo
                paymentStatus: 'pending',
                createdAt: Timestamp.now(),

                // Subscription Details
                planType: selectedPlan,
                sessionsPerMonth: currentPlan.sessions,
                totalSessions: currentPlan.sessions, // Initial booking is for 1 month
                subscriptionStatus: 'active'
            };

            console.log('Creating booking with data:', bookingData);
            const docRef = await addDoc(collection(db, 'bookings'), bookingData);
            console.log('Booking created successfully with ID:', docRef.id);

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to book class. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col md:flex-row">

                {/* Left Side: Plan Selection */}
                <div className="w-full md:w-1/2 bg-slate-50 p-6 md:p-8 overflow-y-auto border-r border-slate-100">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Select Your Plan</h3>
                    <p className="text-sm text-slate-500 mb-6">Choose a learning schedule that fits your needs.</p>

                    <div className="space-y-4">
                        {plans.map((plan) => (
                            <button
                                key={plan.id}
                                type="button"
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${selectedPlan === plan.id
                                        ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100'
                                        : 'border-white bg-white hover:border-indigo-200 shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.color}`}>
                                        <plan.icon size={20} />
                                    </div>
                                    {selectedPlan === plan.id && (
                                        <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-900">{plan.name}</h4>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{plan.daysPerWeek}</div>

                                <div className="space-y-1">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Booking Details */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Finalize Booking</h3>
                            <p className="text-sm text-slate-500">with {teacher.name}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Topic to Study</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Thermodynamics, Calculus..."
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-600" />
                                    First Class Date & Time
                                </label>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                    <input
                                        required
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition mb-4"
                                    />

                                    <div className="grid grid-cols-3 gap-2">
                                        {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map(slot => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, time: slot })}
                                                className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${formData.time === slot
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                            <textarea
                                placeholder="Any specific requirements?"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                rows={2}
                            />
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-slate-500 text-sm">Monthly Fee ({currentPlan.sessions} sessions)</span>
                                <span className="text-xl font-bold text-slate-900">₹{price.toLocaleString()}</span>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : `Confirm ${currentPlan.name}`}
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-3">
                                First session is a free demo. No payment required now.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
