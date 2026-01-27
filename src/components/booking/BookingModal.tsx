import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { X, Loader2, Calendar, Check, Zap, Crown, Star, ChevronRight, ChevronLeft, User, Phone } from 'lucide-react';

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
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('gold');
    const [members, setMembers] = useState<{ name: string; phone: string }[]>([]);
    const [newMember, setNewMember] = useState({ name: '', phone: '' });
    const [showDetails, setShowDetails] = useState(false);

    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [scheduleType, setScheduleType] = useState<'MWF' | 'TTS' | 'custom' | null>(null);

    const [formData, setFormData] = useState({
        topic: '',
        subject: '',
        grade: '',
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
            color: 'bg-cyan-100 text-cyan-700',
            features: ['30 Sessions/Month', 'Dedicated Mentor', '24/7 Support']
        }
    ];

    const currentPlan = plans.find(p => p.id === selectedPlan)!;
    const price = (teacher.hourlyRate || 500) * currentPlan.sessions;

    const handleAddMember = () => {
        if (newMember.name && newMember.phone) {
            setMembers([...members, newMember]);
            setNewMember({ name: '', phone: '' });
        }
    };

    const handleRemoveMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handlePresetSelection = (type: 'MWF' | 'TTS' | 'custom') => {
        setScheduleType(type);
        if (type === 'MWF') {
            setSelectedDays(['Mon', 'Wed', 'Fri']);
        } else if (type === 'TTS') {
            setSelectedDays(['Tue', 'Thu', 'Sat']);
        } else {
            setSelectedDays([]);
        }
    };

    const handleDayToggle = (day: string) => {
        if (selectedPlan === 'platinum') return; // Platinum is always daily
        if (selectedPlan === 'silver' && scheduleType !== 'custom') return; // Must select Custom first for Silver

        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            // Prevent selecting more than allowed
            const maxDays = selectedPlan === 'silver' ? 3 : 6;
            if (selectedDays.length < maxDays) {
                setSelectedDays([...selectedDays, day]);
            }
        }
    };

    // Auto-select days for Platinum
    if (selectedPlan === 'platinum' && selectedDays.length !== 7) {
        setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    }

    const handleNext = () => {
        if (step === 1 && !selectedPlan) return;
        if (step === 2) {
            if (!formData.subject) return alert("Please enter a subject.");
            if (!formData.grade) return alert("Please select a grade/class.");
            if (!formData.topic) return alert("Please enter a topic.");
        }

        if (step === 3) {
            if (!formData.date || !formData.time) return alert("Please select date and time.");

            const requiredDays = selectedPlan === 'silver' ? 3 : (selectedPlan === 'gold' ? 6 : 7);
            if (selectedDays.length !== requiredDays) {
                return alert(`Please select exactly ${requiredDays} days for the ${currentPlan.name}.`);
            }
        }

        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Combine date and time
            const scheduledAt = new Date(`${formData.date}T${formData.time}`);

            const bookingData = {
                teacherId: teacher.uid || (teacher as any).id,
                studentId: studentId,
                studentName: studentName,
                subject: formData.subject,
                grade: formData.grade,
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
                subscriptionStatus: 'active',

                // Group Members
                members: members,
                selectedDays: selectedDays // Save selected days
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
            <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Enroll in Course</h3>
                        <p className="text-sm text-slate-500">Step {step} of 4</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-slate-100 w-full">
                    <div
                        className="h-full bg-cyan-700 transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto flex-grow">

                    {/* Step 1: Plan Selection */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Choose Your Plan</h2>
                                <p className="text-slate-500">Select a learning schedule that works for you.</p>
                            </div>
                            <div className="grid gap-4">
                                {plans.map((plan) => {
                                    const planPrice = (teacher.hourlyRate || 500) * plan.sessions;
                                    return (
                                        <button
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${selectedPlan === plan.id
                                                ? 'border-cyan-700 bg-cyan-50/30 shadow-lg shadow-cyan-100'
                                                : 'border-slate-100 bg-white hover:border-cyan-200 hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.color}`}>
                                                        <plan.icon size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-lg">{plan.name}</h4>
                                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{plan.daysPerWeek}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold text-cyan-700">₹{planPrice.toLocaleString()}</div>
                                                        <div className="text-xs text-slate-400">/month</div>
                                                    </div>
                                                    {selectedPlan === plan.id && (
                                                        <div className="w-6 h-6 bg-cyan-700 text-white rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Check size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Course Details */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Course Details</h2>
                                <p className="text-slate-500">Tell us what you want to learn.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Physics"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Grade / Class</label>
                                    <select
                                        required
                                        value={formData.grade}
                                        onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition font-medium"
                                    >
                                        <option value="">Select Grade</option>
                                        {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College', 'Other'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Topic to Study</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Thermodynamics, Calculus, Python Basics..."
                                    value={formData.topic}
                                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                                <textarea
                                    placeholder="Any specific requirements or goals?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-sm font-medium text-slate-700 mb-4">Add Group Members (Optional)</label>
                                <div className="space-y-3 mb-4">
                                    {members.map((member, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center font-bold text-xs">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="text-sm">
                                                    <div className="font-bold text-slate-900">{member.name}</div>
                                                    <div className="text-slate-500 text-xs">{member.phone}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveMember(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={newMember.name}
                                            onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div className="w-1/3 relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            value={newMember.phone}
                                            onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddMember}
                                        disabled={!newMember.name || !newMember.phone}
                                        className="p-3 bg-cyan-700 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-50 transition-colors"
                                    >
                                        <Check size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Schedule */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Schedule First Class</h2>
                                <p className="text-slate-500">Pick a time for your demo session.</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                <label className="block text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
                                    <Calendar size={18} className="text-cyan-700" />
                                    Select Start Date
                                </label>
                                <input
                                    required
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition mb-6"
                                />

                                <label className="block text-sm font-medium text-slate-700 mb-4">Select Time Slot</label>
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setFormData({ ...formData, time: slot })}
                                            className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${formData.time === slot
                                                ? 'bg-cyan-700 border-cyan-700 text-white shadow-lg shadow-cyan-200'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-slate-200">
                                    <label className="block text-sm font-medium text-slate-700 mb-4">
                                        Preferred Weekly Schedule
                                        <span className="block text-xs text-slate-500 font-normal mt-1">
                                            {selectedPlan === 'platinum'
                                                ? 'Daily classes included in Platinum Plan'
                                                : `Select ${selectedPlan === 'silver' ? 3 : 6} days for ${currentPlan.name}`
                                            }
                                        </span>
                                    </label>

                                    {selectedPlan === 'silver' && (
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <button
                                                onClick={() => handlePresetSelection('MWF')}
                                                className={`p-2 rounded-xl text-xs font-bold border transition-all ${scheduleType === 'MWF'
                                                    ? 'bg-cyan-700 border-cyan-700 text-white'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                Mon-Wed-Fri
                                            </button>
                                            <button
                                                onClick={() => handlePresetSelection('TTS')}
                                                className={`p-2 rounded-xl text-xs font-bold border transition-all ${scheduleType === 'TTS'
                                                    ? 'bg-cyan-700 border-cyan-700 text-white'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                Tue-Thu-Sat
                                            </button>
                                            <button
                                                onClick={() => handlePresetSelection('custom')}
                                                className={`p-2 rounded-xl text-xs font-bold border transition-all ${scheduleType === 'custom'
                                                    ? 'bg-cyan-700 border-cyan-700 text-white'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                Custom
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                                            const isSelected = selectedDays.includes(day);
                                            const isDisabled = selectedPlan === 'platinum' || (selectedPlan === 'silver' && scheduleType !== 'custom');

                                            return (
                                                <button
                                                    key={day}
                                                    onClick={() => handleDayToggle(day)}
                                                    disabled={isDisabled}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected
                                                        ? 'bg-cyan-700 text-white shadow-md shadow-cyan-200'
                                                        : 'bg-white border border-slate-200 text-slate-500'
                                                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan-300'}`}
                                                >
                                                    {day.charAt(0)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Confirm Booking</h2>
                                <p className="text-slate-500">Review your details before confirming.</p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="w-full p-4 flex items-center justify-between text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <span className="font-bold text-sm">Booking Summary</span>
                                    {showDetails ? <ChevronRight size={18} className="-rotate-90 transition-transform" /> : <ChevronRight size={18} className="rotate-90 transition-transform" />}
                                </button>

                                {showDetails && (
                                    <div className="px-6 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                            <span className="text-slate-500">Teacher</span>
                                            <span className="font-bold text-slate-900">{teacher.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                            <span className="text-slate-500">Plan</span>
                                            <span className="font-bold text-cyan-700">{currentPlan.name} ({currentPlan.sessions} sessions)</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                            <span className="text-slate-500">Subject</span>
                                            <span className="font-bold text-slate-900">{formData.subject} ({formData.grade})</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                            <span className="text-slate-500">Topic</span>
                                            <span className="font-bold text-slate-900">{formData.topic}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                            <span className="text-slate-500">First Class</span>
                                            <span className="font-bold text-slate-900">{formData.date} at {formData.time}</span>
                                        </div>
                                        <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                                            <span className="text-slate-500 whitespace-nowrap">Schedule</span>
                                            <span className="font-bold text-slate-900 text-right">{selectedDays.join(', ')}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-slate-500 font-medium">Monthly Plan Value</span>
                                            <span className="text-lg font-bold text-slate-400">₹{price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-100 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-900 font-bold text-lg">Payable Now</span>
                                    <span className="text-3xl font-bold text-emerald-600">₹0</span>
                                </div>
                                <p className="text-xs text-slate-400 text-right">No credit card required</p>
                            </div>

                            <div className="bg-emerald-50 text-emerald-800 text-sm p-4 rounded-xl flex gap-3 items-start border border-emerald-100">
                                <div className="mt-0.5"><Zap size={16} className="fill-emerald-600 text-emerald-600" /></div>
                                <div>
                                    <p className="font-bold mb-1">Your First Class is Free!</p>
                                    <p className="text-emerald-700">This is a demo session. You only pay if you decide to continue with the course after this class.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft size={18} /> Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 flex items-center gap-2"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Booking'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
