import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock, ArrowRight, Sunrise, Sun, Moon, Check, Calendar, Users, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '@/lib/plans';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BookingSelectionModalProps {
    teacher: any;
    studentId: string;
    onClose: () => void;
}



const STEPS = [
    { id: 1, label: 'Select Plan', icon: CreditCard },
    { id: 2, label: 'Schedule', icon: Calendar },
    { id: 3, label: 'Details', icon: Users },
];

export default function BookingSelectionModal({ teacher, studentId, onClose }: BookingSelectionModalProps) {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Step 3 States
    const [courseTopic, setCourseTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [members, setMembers] = useState<{ name: string; phone: string }[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');

    // Step 1 States
    const [paymentMode, setPaymentMode] = useState<'monthly' | 'full'>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<string>('gold');

    // Step 2 States
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
            setStep(2);
        } else if (step === 2) {
            if (selectedDate && selectedSlot) {
                setStep(3);
            }
        } else {
            if (!courseTopic || !subject || !grade) return;

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
                    subject,
                    grade,
                    courseDescription,
                    members
                }
            });
        }
    };

    const handleBack = () => {
        if (step === 3) setStep(2);
        else if (step === 2) setStep(1);
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
                {/* Header with Stepper */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between p-6 pb-2">
                        <div className="flex items-center gap-4">
                            {(step === 2 || step === 3) && (
                                <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
                                    <ChevronLeft size={20} />
                                </Button>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    Book a Session
                                </h2>
                                <p className="text-sm text-slate-500">with {teacher.name}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X size={24} className="text-slate-500" />
                        </Button>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between px-8 py-4">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className="flex flex-1 items-center">
                                <div className="flex flex-col items-center relative z-10 gap-1">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        step >= s.id ? "bg-cyan-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                    )}>
                                        {step > s.id ? <Check size={14} /> : s.id}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-medium transition-all absolute top-full mt-1 whitespace-nowrap",
                                        step >= s.id ? "text-cyan-700 dark:text-cyan-400" : "text-slate-400"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn(
                                        "h-[2px] w-full mx-2 transition-all",
                                        step > s.id ? "bg-cyan-700" : "bg-slate-100 dark:bg-slate-800"
                                    )} />
                                )}
                            </div>
                        ))}
                        {/* Final spacer to balance the last item if needed, but justify-between works */}
                        {/* Actually, the above flex-1 approach puts lines to the right of items. The last item shouldn't have a line. */}
                        {/* Correcting Logic: The items should be centered nodes with lines between them. */}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 pt-8">
                    {/* Step 1: Select Plan */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Choose your plan</h3>
                                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg inline-flex">
                                    <button
                                        onClick={() => setPaymentMode('monthly')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                                            paymentMode === 'monthly' ? "bg-white dark:bg-slate-700 shadow-sm text-cyan-700 dark:text-cyan-400" : "text-slate-500"
                                        )}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setPaymentMode('full')}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                                            paymentMode === 'full' ? "bg-white dark:bg-slate-700 shadow-sm text-cyan-700 dark:text-cyan-400" : "text-slate-500"
                                        )}
                                    >
                                        Full Course
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {PLANS.map(plan => {
                                    const totalSessions = paymentMode === 'monthly'
                                        ? plan.classesPerWeek * 4
                                        : plan.classesPerWeek * 20; // Assuming ~5 months for full course

                                    return (
                                        <div
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={cn(
                                                "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group",
                                                selectedPlan === plan.id
                                                    ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/10 shadow-md transform scale-[1.02]"
                                                    : "border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                                    selectedPlan === plan.id ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {plan.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{plan.name} Plan</h4>
                                                        {plan.popular && <Badge className="bg-amber-500 hover:bg-amber-500 text-[10px] h-5">POPULAR</Badge>}
                                                    </div>
                                                    <p className="text-sm text-slate-500">{plan.classesPerWeek} classes per week</p>
                                                    <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                                                        Total Sessions: {totalSessions}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-lg text-slate-900 dark:text-slate-100">
                                                    ₹{paymentMode === 'monthly' ? plan.priceMonthly : plan.priceFull}
                                                </span>
                                                <span className="text-xs text-slate-400">{paymentMode === 'monthly' ? '/month' : '/course'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Plan Features:</h4>
                                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                                    <li>Interactive live sessions</li>
                                    <li>Access to class recordings</li>
                                    <li>Doubt solving support</li>
                                    {selectedPlan === 'platinum' && <li><strong>1-on-1 Mentorship included</strong></li>}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Schedule */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-cyan-600 font-bold uppercase tracking-wider block mb-1">Selected Plan</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{PLANS.find(p => p.id === selectedPlan)?.name} Plan</span>
                                </div>
                                <Button variant="link" size="sm" onClick={() => setStep(1)} className="text-cyan-700 h-auto p-0">Change</Button>
                            </div>

                            {selectedPlan === 'silver' && (
                                <div className="space-y-3">
                                    <Label>Preferred Schedule</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setSilverOption('MWF')}
                                            className={cn(
                                                "p-3 rounded-xl border-2 cursor-pointer text-center transition-all",
                                                silverOption === 'MWF' ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-100 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="font-bold block">Mon - Wed - Fri</span>
                                        </div>
                                        <div
                                            onClick={() => setSilverOption('TTS')}
                                            className={cn(
                                                "p-3 rounded-xl border-2 cursor-pointer text-center transition-all",
                                                silverOption === 'TTS' ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-slate-100 hover:border-slate-200"
                                            )}
                                        >
                                            <span className="font-bold block">Tue - Thu - Sat</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Select Start Date</Label>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0} className="h-8 w-8">
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <span className="text-xs font-bold w-24 text-center">
                                            {dates[0].toLocaleDateString('default', { month: 'short', day: 'numeric' })} - {dates[6].toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                                        </span>
                                        <Button variant="ghost" size="icon" onClick={() => setWeekOffset(weekOffset + 1)} className="h-8 w-8">
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <ScrollArea className="w-full pb-4">
                                    <div className="flex gap-2">
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
                                                            setSelectedSlot(null);
                                                        }
                                                    }}
                                                    disabled={!isAvailable}
                                                    className={cn(
                                                        "flex-shrink-0 w-[4.5rem] flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                                                        isSelected ? "bg-cyan-700 text-white border-cyan-700 shadow-md transform scale-105" :
                                                            isAvailable ? "bg-white dark:bg-slate-900 border-slate-200 hover:border-cyan-300 text-slate-700 dark:text-slate-300" :
                                                                "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-300 cursor-not-allowed"
                                                    )}
                                                >
                                                    <span className="text-[10px] font-medium uppercase mb-0.5">{dayName}</span>
                                                    <span className="text-xl font-bold">{date.getDate()}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </div>

                            {selectedDate && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <Clock size={16} className="text-cyan-600" />
                                        Available slots for {selectedDate.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </div>

                                    {!hasSlots ? (
                                        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200">
                                            <p className="text-slate-500 text-sm">No slots available for this day. Please choose another date.</p>
                                        </div>
                                    ) : (
                                        <ScrollArea className="h-48 pr-4">
                                            <div className="space-y-4">
                                                {availableSlots.morning.length > 0 && (
                                                    <div className="space-y-2">
                                                        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                            <Sunrise size={14} /> Morning
                                                        </span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {availableSlots.morning.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedSlot(time)}
                                                                    className={cn("px-3 py-2 text-xs font-bold rounded-lg border transition-all", selectedSlot === time ? "bg-cyan-100 text-cyan-800 border-cyan-300" : "bg-white border-slate-200 hover:border-cyan-200")}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {availableSlots.afternoon.length > 0 && (
                                                    <div className="space-y-2">
                                                        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                            <Sun size={14} /> Afternoon
                                                        </span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {availableSlots.afternoon.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedSlot(time)}
                                                                    className={cn("px-3 py-2 text-xs font-bold rounded-lg border transition-all", selectedSlot === time ? "bg-cyan-100 text-cyan-800 border-cyan-300" : "bg-white border-slate-200 hover:border-cyan-200")}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {availableSlots.evening.length > 0 && (
                                                    <div className="space-y-2">
                                                        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                            <Moon size={14} /> Evening
                                                        </span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {availableSlots.evening.map(time => (
                                                                <button
                                                                    key={time}
                                                                    onClick={() => setSelectedSlot(time)}
                                                                    className={cn("px-3 py-2 text-xs font-bold rounded-lg border transition-all", selectedSlot === time ? "bg-cyan-100 text-cyan-800 border-cyan-300" : "bg-white border-slate-200 hover:border-cyan-200")}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>
                            )}

                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-800 flex items-center gap-4">
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <div className="text-center min-w-[3rem]">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 block">{selectedDate?.toLocaleDateString('default', { month: 'short' })}</span>
                                        <span className="text-xl font-bold text-slate-900">{selectedDate?.getDate()}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{selectedSlot}</h4>
                                        <Button variant="link" size="sm" onClick={() => setStep(2)} className="text-cyan-700 h-auto p-0">Change</Button>
                                    </div>
                                    <p className="text-xs text-slate-500">First session starts on {selectedDate?.toLocaleDateString('default', { weekday: 'long' })}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Subject <span className="text-red-500">*</span></Label>
                                    <Select value={subject} onValueChange={setSubject}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science', 'Economics'].map(s => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Grade/Class <span className="text-red-500">*</span></Label>
                                    <Select value={grade} onValueChange={setGrade}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Class 9', 'Class 10', 'Class 11', 'Class 12', 'College'].map(g => (
                                                <SelectItem key={g} value={g}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Topic / Course Title <span className="text-red-500">*</span></Label>
                                <Input
                                    value={courseTopic}
                                    onChange={(e) => setCourseTopic(e.target.value)}
                                    placeholder="e.g. Thermodynamics, calculus, etc."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea
                                    value={courseDescription}
                                    onChange={(e) => setCourseDescription(e.target.value)}
                                    placeholder="Briefly describe what you want to learn..."
                                    className="h-20 resize-none"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label>Invite Friends (Group Study)</Label>
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Get 5% off per friend</span>
                                </div>

                                <div className="flex gap-2 items-end">
                                    <div className="w-32">
                                        <Label className="text-xs text-slate-500 mb-1.5 block">Phone Number</Label>
                                        <Input
                                            value={newMemberPhone}
                                            onChange={(e) => setNewMemberPhone(e.target.value)}
                                            placeholder="98765..."
                                            className="h-10"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Label className="text-xs text-slate-500 mb-1.5 block">Student Name</Label>
                                        <Input
                                            value={newMemberName}
                                            readOnly
                                            placeholder="Name auto-fills..."
                                            className="h-10 bg-slate-50 dark:bg-slate-900 text-slate-500"
                                        />
                                    </div>
                                    <Button onClick={handleAddMember} disabled={!newMemberPhone} size="icon" className="h-10 w-10 shrink-0">
                                        <Users size={18} />
                                    </Button>
                                </div>

                                {members.length > 0 && (
                                    <div className="space-y-2">
                                        {members.map((member, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                    <span>{member.name}</span>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleRemoveMember(idx)}>
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <Button
                        onClick={handleContinue}
                        disabled={
                            step === 2 ? (!selectedDate || !selectedSlot) :
                                step === 3 ? (!courseTopic || !subject || !grade) : false
                        }
                        className="w-full py-6 text-base font-bold shadow-lg shadow-cyan-700/20"
                    >
                        {step === 3 ? 'Proceed to Checkout' : 'Next Step'} <ArrowRight className="ml-2" size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
