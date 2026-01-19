import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, ArrowRight, Sunrise, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingSelectionModalProps {
    teacher: any;
    studentId: string;
    onClose: () => void;
}

const PLANS = [
    {
        id: 'silver',
        name: 'Silver',
        classesPerWeek: 3,
        priceMonthly: 2000,
        priceFull: 10000,
        type: 'selection', // MWF or TTS
        options: [
            { label: 'MWF', days: ['Mon', 'Wed', 'Fri'] },
            { label: 'TTS', days: ['Tue', 'Thu', 'Sat'] }
        ]
    },
    {
        id: 'gold',
        name: 'Gold',
        classesPerWeek: 6,
        priceMonthly: 3500,
        priceFull: 18000,
        type: 'fixed',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        popular: true
    },
    {
        id: 'platinum',
        name: 'Platinum',
        classesPerWeek: 7,
        priceMonthly: 5000,
        priceFull: 25000,
        type: 'fixed',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function BookingSelectionModal({ teacher, studentId, onClose }: BookingSelectionModalProps) {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [courseTopic, setCourseTopic] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [members, setMembers] = useState<{ name: string; phone: string }[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');

    const [paymentMode, setPaymentMode] = useState<'monthly' | 'full'>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<string>('gold');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [silverOption, setSilverOption] = useState<'MWF' | 'TTS'>('MWF');
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    // Update selected days when plan or silver option changes
    useEffect(() => {
        const plan = PLANS.find(p => p.id === selectedPlan);
        if (plan) {
            if (plan.type === 'fixed') {
                setSelectedDays(plan.days || []);
            } else if (plan.id === 'silver') {
                const option = plan.options?.find(o => o.label === silverOption);
                setSelectedDays(option?.days || []);
            }
            // Reset date/slot if current selection is invalid
            setSelectedDate(null);
            setSelectedSlot(null);
        }
    }, [selectedPlan, silverOption]);

    // Generate dates for the week
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

    const handleAddMember = () => {
        if (newMemberName && newMemberPhone) {
            setMembers([...members, { name: newMemberName, phone: newMemberPhone }]);
            setNewMemberName('');
            setNewMemberPhone('');
        }
    };

    const handleRemoveMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleContinue = () => {
        if (step === 1) {
            if (selectedDate && selectedSlot) {
                setStep(2);
            }
        } else {
            if (!courseTopic) return;

            const planDetails = PLANS.find(p => p.id === selectedPlan);

            navigate('/student/booking/checkout', {
                state: {
                    teacher,
                    studentId,
                    paymentMode,
                    plan: { ...planDetails, selectedDays },
                    date: selectedDate?.toISOString(),
                    slot: selectedSlot,
                    courseTopic,
                    courseDescription,
                    members
                }
            });
        }
    };

    // Get available slots for the selected date
    const getAvailableSlots = () => {
        if (!selectedDate || !teacher.availability) return { morning: [], afternoon: [], evening: [], night: [] };

        const dayName = selectedDate.toLocaleDateString('default', { weekday: 'short' });
        const dayAvailability = teacher.availability[dayName];

        if (!dayAvailability || !dayAvailability.enabled) return { morning: [], afternoon: [], evening: [], night: [] };

        const slots = {
            morning: [] as string[],
            afternoon: [] as string[],
            evening: [] as string[],
            night: [] as string[]
        };

        dayAvailability.slots.forEach((slot: any) => {
            const timeString = `${formatTime(slot.start)} - ${formatTime(slot.end)}`;
            if (slot.period === 'Morning') slots.morning.push(timeString);
            else if (slot.period === 'Afternoon') slots.afternoon.push(timeString);
            else if (slot.period === 'Evening') slots.evening.push(timeString);
            else if (slot.period === 'Night') slots.night.push(timeString);
        });

        return slots;
    };

    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minute} ${ampm}`;
    };

    const availableSlots = getAvailableSlots();
    const hasSlots = availableSlots.morning.length > 0 || availableSlots.afternoon.length > 0 || availableSlots.evening.length > 0 || availableSlots.night.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800">
                            <img src={teacher.photoURL || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop"} alt={teacher.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {step === 1 ? 'Book a session' : 'Course Details'}
                            </h2>
                            <p className="text-sm text-slate-500">with {teacher.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {step === 1 ? (
                        <>
                            {/* Payment Mode & Plan Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Select Plan</h3>
                                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
                                        <button
                                            onClick={() => setPaymentMode('monthly')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${paymentMode === 'monthly' ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}
                                        >
                                            Monthly
                                        </button>
                                        <button
                                            onClick={() => setPaymentMode('full')}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${paymentMode === 'full' ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}
                                        >
                                            Full Course
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {PLANS.map(plan => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-cyan-200'}`}
                                        >
                                            {plan.popular && (
                                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    POPULAR
                                                </div>
                                            )}
                                            <div className="text-center mb-2">
                                                <div className="font-bold text-slate-900 dark:text-slate-100">{plan.name}</div>
                                                <div className="text-xs text-slate-500">{plan.classesPerWeek} days/week</div>
                                            </div>
                                            <div className="text-center">
                                                <span className="font-bold text-lg text-slate-900 dark:text-slate-100">₹{paymentMode === 'monthly' ? plan.priceMonthly : plan.priceFull}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Day Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Selected Days</h3>
                                    {selectedPlan === 'silver' && (
                                        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
                                            <button
                                                onClick={() => setSilverOption('MWF')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${silverOption === 'MWF' ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}
                                            >
                                                MWF
                                            </button>
                                            <button
                                                onClick={() => setSilverOption('TTS')}
                                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${silverOption === 'TTS' ? 'bg-white dark:bg-slate-700 shadow-sm text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}
                                            >
                                                TTS
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map(day => {
                                        const isSelected = selectedDays.includes(day);
                                        return (
                                            <div
                                                key={day}
                                                className={`flex-1 min-w-[40px] py-2 rounded-lg text-sm font-medium border text-center transition-all ${isSelected
                                                    ? 'bg-cyan-700 text-white border-cyan-700 shadow-sm'
                                                    : 'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-700 border-slate-100 dark:border-slate-800'
                                                    }`}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-slate-500">
                                    {selectedPlan === 'silver'
                                        ? "Choose between Mon-Wed-Fri or Tue-Thu-Sat schedule."
                                        : selectedPlan === 'gold'
                                            ? "Gold plan includes classes from Monday to Saturday."
                                            : "Platinum plan includes classes on all days of the week."}
                                </p>
                            </div>

                            {/* Schedule Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Select Starting Date and Time</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                                            disabled={weekOffset === 0}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            {dates[0].toLocaleDateString('default', { month: 'short', day: 'numeric' })} - {dates[6].toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <button
                                            onClick={() => setWeekOffset(prev => prev + 1)}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar Strip */}
                                <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                                    {dates.map((date, index) => {
                                        const dayName = date.toLocaleDateString('default', { weekday: 'short' });
                                        const isAvailable = selectedDays.includes(dayName);
                                        const isSelected = selectedDate?.toDateString() === date.toDateString();

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (isAvailable) {
                                                        setSelectedDate(date);
                                                        setSelectedSlot(null); // Reset slot on date change
                                                    }
                                                }}
                                                disabled={!isAvailable}
                                                className={`flex-1 min-w-[60px] flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isSelected
                                                    ? 'bg-cyan-700 text-white border-cyan-700 shadow-md transform scale-105'
                                                    : isAvailable
                                                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-cyan-300'
                                                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                                    }`}
                                            >
                                                <span className="text-xs font-medium mb-1">{dayName}</span>
                                                <span className="text-lg font-bold">{date.getDate()}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Time Slots */}
                                {selectedDate && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Clock size={14} />
                                            <span>Available slots for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                        </div>

                                        {!hasSlots ? (
                                            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                                <p className="text-slate-500">No slots available for this day.</p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Morning Slots */}
                                                {availableSlots.morning.length > 0 && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            <Sunrise size={16} className="text-amber-500" />
                                                            Morning
                                                        </div>
                                                        <div className="flex flex-wrap gap-3">
                                                            {availableSlots.morning.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedSlot(time)}
                                                                    className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${selectedSlot === time ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-300'}`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Afternoon Slots */}
                                                {availableSlots.afternoon.length > 0 && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            <Sun size={16} className="text-orange-500" />
                                                            Afternoon
                                                        </div>
                                                        <div className="flex flex-wrap gap-3">
                                                            {availableSlots.afternoon.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedSlot(time)}
                                                                    className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${selectedSlot === time ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-300'}`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Evening Slots */}
                                                {availableSlots.evening.length > 0 && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            <Moon size={16} className="text-indigo-500" />
                                                            Evening
                                                        </div>
                                                        <div className="flex flex-wrap gap-3">
                                                            {availableSlots.evening.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedSlot(time)}
                                                                    className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${selectedSlot === time ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-300'}`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Night Slots */}
                                                {availableSlots.night.length > 0 && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                                                            <Moon size={16} className="text-slate-600" />
                                                            Night
                                                        </div>
                                                        <div className="flex flex-wrap gap-3">
                                                            {availableSlots.night.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedSlot(time)}
                                                                    className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${selectedSlot === time ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-cyan-300'}`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Course Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={courseTopic}
                                        onChange={(e) => setCourseTopic(e.target.value)}
                                        placeholder="e.g. Physics for Class 12th"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Description (Optional)</label>
                                    <textarea
                                        value={courseDescription}
                                        onChange={(e) => setCourseDescription(e.target.value)}
                                        placeholder="Briefly describe what you want to learn..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none h-24 resize-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Add Friends (Group Study)</label>
                                        <p className="text-xs text-slate-500 mb-2">Add friends to your group and get 5% discount for each member!</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                                            <input
                                                type="text"
                                                value={newMemberName}
                                                onChange={(e) => setNewMemberName(e.target.value)}
                                                placeholder="Friend's Name"
                                                className="sm:col-span-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                                            />
                                            <input
                                                type="tel"
                                                value={newMemberPhone}
                                                onChange={(e) => setNewMemberPhone(e.target.value)}
                                                placeholder="Phone Number"
                                                className="sm:col-span-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                                            />
                                            <button
                                                onClick={handleAddMember}
                                                disabled={!newMemberName || !newMemberPhone}
                                                className="sm:col-span-1 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {members.length > 0 && (
                                            <div className="flex flex-col gap-2 mt-3">
                                                {members.map((member, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 px-4 py-2 rounded-lg text-sm font-medium border border-cyan-100 dark:border-cyan-800">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold">{member.name}</span>
                                                            <span className="text-xs opacity-70">({member.phone})</span>
                                                        </div>
                                                        <button onClick={() => handleRemoveMember(idx)} className="hover:text-red-500 transition-colors p-1">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <button
                        onClick={handleContinue}
                        disabled={step === 1 ? (!selectedDate || !selectedSlot) : (!courseTopic)}
                        className="w-full py-3.5 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-700/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {step === 1 ? 'Next Step' : 'Proceed to Checkout'} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
