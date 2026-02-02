import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Save, Plus, CheckCircle, AlertCircle, Sun, Moon, Sunrise, Copy, RotateCcw, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
    start: string;
    end: string;
    period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
}

interface DayAvailability {
    enabled: boolean;
    slots: TimeSlot[];
}

interface WeeklyAvailability {
    [key: string]: DayAvailability;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_AVAILABILITY: WeeklyAvailability = DAYS.reduce((acc, day) => {
    acc[day] = { enabled: false, slots: [] };
    return acc;
}, {} as WeeklyAvailability);

const PERIODS = [
    { label: 'Morning', icon: Sunrise, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', range: '06:00 - 12:00' },
    { label: 'Afternoon', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', range: '12:00 - 17:00' },
    { label: 'Evening', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', range: '17:00 - 21:00' },
    { label: 'Night', icon: Moon, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', range: '21:00 - 04:00' },
] as const;

export default function TeacherAvailability() {
    const { user } = useAuth();
    const [availability, setAvailability] = useState<WeeklyAvailability>(DEFAULT_AVAILABILITY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Master Schedule State
    const [masterSlots, setMasterSlots] = useState<TimeSlot[]>([]);
    const [selectedMasterDays, setSelectedMasterDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

    useEffect(() => {
        async function fetchAvailability() {
            if (!user) return;
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().availability) {
                    setAvailability(docSnap.data().availability);
                }
            } catch (error) {
                console.error('Error fetching availability:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAvailability();
    }, [user]);

    const handleToggleDay = (day: string) => {
        setAvailability(prev => ({
            ...prev,
            [day]: { ...prev[day], enabled: !prev[day].enabled }
        }));
    };

    const handleAddSlot = (day: string, period: 'Morning' | 'Afternoon' | 'Evening' | 'Night') => {
        const defaultTimes = {
            'Morning': { start: '09:00', end: '10:00' },
            'Afternoon': { start: '14:00', end: '15:00' },
            'Evening': { start: '18:00', end: '19:00' },
            'Night': { start: '21:00', end: '22:00' }
        };

        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: [...prev[day].slots, { ...defaultTimes[period], period }]
            }
        }));
    };

    const handleRemoveSlot = (day: string, index: number) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.filter((_, i) => i !== index)
            }
        }));
    };

    const handleTimeChange = (day: string, index: number, field: 'start' | 'end', value: string) => {
        setAvailability(prev => {
            const newSlots = [...prev[day].slots];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return {
                ...prev,
                [day]: { ...prev[day], slots: newSlots }
            };
        });
    };

    // Master Schedule Functions
    const addMasterSlot = (period: 'Morning' | 'Afternoon' | 'Evening' | 'Night') => {
        const defaultTimes = {
            'Morning': { start: '09:00', end: '10:00' },
            'Afternoon': { start: '14:00', end: '15:00' },
            'Evening': { start: '18:00', end: '19:00' },
            'Night': { start: '21:00', end: '22:00' }
        };
        setMasterSlots(prev => [...prev, { ...defaultTimes[period], period }]);
    };

    const removeMasterSlot = (index: number) => {
        setMasterSlots(prev => prev.filter((_, i) => i !== index));
    };

    const updateMasterSlot = (index: number, field: 'start' | 'end', value: string) => {
        setMasterSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return newSlots;
        });
    };

    const toggleMasterDay = (day: string) => {
        setSelectedMasterDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const applyMasterSchedule = () => {
        setAvailability(prev => {
            const next = { ...prev };
            selectedMasterDays.forEach(day => {
                next[day] = {
                    enabled: true,
                    slots: [...masterSlots] // Copy master slots to each selected day
                };
            });
            return next;
        });
        setMessage({ type: 'success', text: `Applied master schedule to ${selectedMasterDays.length} days.` });
        setTimeout(() => setMessage(null), 3000);
    };

    const saveAvailability = async () => {
        if (!user) return;
        setSaving(true);
        setMessage(null);
        try {
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, { availability });
            setMessage({ type: 'success', text: 'Availability saved successfully!' });
        } catch (error) {
            console.error('Error saving availability:', error);
            setMessage({ type: 'error', text: 'Failed to save availability. Please try again.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Helper to generate hour options based on period
    const generateHourOptions = (periodLabel: string) => {
        const period = PERIODS.find(p => p.label === periodLabel);
        if (!period) return [];

        const [startStr, endStr] = period.range.split(' - ');
        const startHour = parseInt(startStr.split(':')[0]);
        let endHour = parseInt(endStr.split(':')[0]);

        // Handle Night period crossing midnight (21:00 - 04:00)
        if (endHour < startHour) {
            endHour += 24;
        }

        const options = [];
        for (let h = startHour; h <= endHour; h++) {
            const hour = h % 24;
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            options.push(timeString);
        }
        return options;
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[50vh]">Loading...</div>;
    }

    return (
        <div className="w-full space-y-8 pb-24">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Availability Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Set your weekly schedule. Use the Master Schedule to quickly set multiple days.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Master Schedule Section */}
            <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <Copy className="bg-cyan-100 text-cyan-700 p-1.5 rounded-lg" size={32} />
                        Master Schedule
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMasterSlots([])}
                        className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                        <RotateCcw size={14} className="mr-1" /> Reset
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 mb-6 font-medium">
                        Define a schedule here and apply it to multiple days at once. Great for setting standard weekly hours.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Define Slots */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs">1</span>
                                Define Slots
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {PERIODS.map(period => (
                                    <Button
                                        key={period.label}
                                        onClick={() => addMasterSlot(period.label as any)}
                                        variant="outline"
                                        size="sm"
                                        className={`text-xs font-bold border ${period.bg} ${period.color} ${period.border} hover:brightness-95 h-8`}
                                    >
                                        <Plus size={12} className="mr-1.5" /> {period.label}
                                    </Button>
                                ))}
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {masterSlots.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                                        <Clock className="mx-auto text-slate-300 mb-2" size={24} />
                                        <p className="text-slate-400 text-sm font-medium">No slots added yet</p>
                                    </div>
                                ) : (
                                    masterSlots.map((slot, index) => {
                                        const periodStyle = PERIODS.find(p => p.label === slot.period) || PERIODS[0];
                                        const hourOptions = generateHourOptions(slot.period);

                                        return (
                                            <div key={index} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${periodStyle.bg} ${periodStyle.color}`}>
                                                    {slot.period}
                                                </span>
                                                <div className="grid grid-cols-2 gap-2 flex-1">
                                                    <select
                                                        value={slot.start}
                                                        onChange={(e) => updateMasterSlot(index, 'start', e.target.value)}
                                                        className="w-full text-xs font-bold bg-transparent border-b border-slate-200 focus:border-cyan-500 outline-none text-slate-700 dark:text-slate-300 py-1"
                                                    >
                                                        {hourOptions.map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={slot.end}
                                                        onChange={(e) => updateMasterSlot(index, 'end', e.target.value)}
                                                        className="w-full text-xs font-bold bg-transparent border-b border-slate-200 focus:border-cyan-500 outline-none text-slate-700 dark:text-slate-300 py-1"
                                                    >
                                                        {hourOptions.map(time => (
                                                            <option key={time} value={time}>{time}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => removeMasterSlot(index)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Right: Select Days & Apply */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs">2</span>
                                Apply to Days
                            </h3>

                            {/* Quick Patterns */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {[
                                    { label: 'MWF', days: ['Mon', 'Wed', 'Fri'] },
                                    { label: 'TTS', days: ['Tue', 'Thu', 'Sat'] },
                                    { label: 'Mon-Sat', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
                                    { label: 'All Days', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                                ].map(pattern => (
                                    <Button
                                        key={pattern.label}
                                        onClick={() => setSelectedMasterDays(pattern.days)}
                                        variant="secondary"
                                        size="sm"
                                        className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-700 dark:hover:text-cyan-400 h-8"
                                    >
                                        {pattern.label}
                                    </Button>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {DAYS.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => toggleMasterDay(day)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${selectedMasterDays.includes(day)
                                            ? 'bg-cyan-700 text-white shadow-md scale-105'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={applyMasterSchedule}
                                    disabled={masterSlots.length === 0 || selectedMasterDays.length === 0}
                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 shadow-lg shadow-slate-900/10"
                                >
                                    <Copy size={18} className="mr-2" /> Apply to Selected Days
                                </Button>
                                <p className="text-xs text-slate-400 mt-2 text-center font-medium">
                                    This will overwrite existing slots for the selected days.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 px-2 flex items-center gap-2">
                    <Clock size={24} className="text-cyan-600" /> Weekly Schedule
                </h2>
                {DAYS.map(day => (
                    <Card key={day} className={`rounded-2xl transition-all ${availability[day]?.enabled ? 'border-slate-200 dark:border-slate-800 shadow-sm' : 'border-slate-100 dark:border-slate-800 opacity-70'}`}>
                        {/* Day Header */}
                        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={availability[day]?.enabled}
                                        onChange={() => handleToggleDay(day)}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-700"></div>
                                </label>
                                <span className={`font-bold text-lg ${availability[day]?.enabled ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>{day}</span>
                            </div>
                            {!availability[day]?.enabled && (
                                <Badge variant="secondary" className="text-slate-400 bg-slate-100 dark:bg-slate-800">Unavailable</Badge>
                            )}
                        </div>

                        {/* Periods */}
                        {availability[day]?.enabled && (
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {PERIODS.map(period => {
                                    const PeriodIcon = period.icon;
                                    const periodSlots = availability[day].slots
                                        .map((slot, idx) => ({ ...slot, originalIndex: idx }))
                                        .filter(slot => slot.period === period.label);

                                    const hourOptions = generateHourOptions(period.label);

                                    return (
                                        <div key={period.label} className={`rounded-xl border ${period.border} ${period.bg} p-4 space-y-3`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <PeriodIcon size={18} className={period.color} />
                                                    <span className={`font-bold text-sm ${period.color}`}>{period.label}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleAddSlot(day, period.label as any)}
                                                    className={`p-1.5 rounded-lg hover:bg-white/50 transition-colors ${period.color}`}
                                                    title="Add Slot"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                {periodSlots.length === 0 ? (
                                                    <div className="text-xs text-slate-400 text-center py-2 italic">No slots</div>
                                                ) : (
                                                    periodSlots.map((slot, i) => (
                                                        <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                                                            <div className="grid grid-cols-2 gap-2 flex-1">
                                                                <select
                                                                    value={slot.start}
                                                                    onChange={(e) => handleTimeChange(day, slot.originalIndex, 'start', e.target.value)}
                                                                    className="w-full text-xs font-bold bg-transparent border-b border-slate-200 focus:border-cyan-500 outline-none text-slate-700 dark:text-slate-300 py-1"
                                                                >
                                                                    {hourOptions.map(time => (
                                                                        <option key={time} value={time}>{time}</option>
                                                                    ))}
                                                                </select>
                                                                <select
                                                                    value={slot.end}
                                                                    onChange={(e) => handleTimeChange(day, slot.originalIndex, 'end', e.target.value)}
                                                                    className="w-full text-xs font-bold bg-transparent border-b border-slate-200 focus:border-cyan-500 outline-none text-slate-700 dark:text-slate-300 py-1"
                                                                >
                                                                    {hourOptions.map(time => (
                                                                        <option key={time} value={time}>{time}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveSlot(day, slot.originalIndex)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <div className="fixed bottom-6 right-6 z-20">
                <Button
                    onClick={saveAvailability}
                    disabled={saving}
                    className="h-14 px-8 bg-cyan-700 hover:bg-cyan-800 text-base font-bold rounded-full shadow-xl shadow-cyan-700/30"
                >
                    {saving ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save size={20} className="mr-2" /> Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div >
    );
}
