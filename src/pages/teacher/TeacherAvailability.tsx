import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Clock, Save, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface TimeSlot {
    start: string;
    end: string;
}

interface DayAvailability {
    enabled: boolean;
    slots: TimeSlot[];
}

interface WeeklyAvailability {
    [key: string]: DayAvailability;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_AVAILABILITY: WeeklyAvailability = DAYS.reduce((acc, day) => {
    acc[day] = { enabled: false, slots: [{ start: '09:00', end: '17:00' }] };
    return acc;
}, {} as WeeklyAvailability);

export default function TeacherAvailability() {
    const { user } = useAuth();
    const [availability, setAvailability] = useState<WeeklyAvailability>(DEFAULT_AVAILABILITY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    const handleAddSlot = (day: string) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: [...prev[day].slots, { start: '09:00', end: '10:00' }]
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

    if (loading) {
        return <div className="flex items-center justify-center min-h-[50vh]">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Availability Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Set your weekly schedule so students can book sessions with you.</p>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm">
                        <strong>Note:</strong> Please update your availability every 2 months to ensure a better student experience and avoid scheduling conflicts.
                    </p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 space-y-8">
                    {DAYS.map(day => (
                        <div key={day} className={`pb-8 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 ${availability[day]?.enabled ? 'opacity-100' : 'opacity-60'}`}>
                            <div className="flex items-center justify-between mb-4">
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
                                    <span className="font-bold text-lg text-slate-900 dark:text-slate-100 w-24">{day}</span>
                                </div>
                                {availability[day]?.enabled && (
                                    <button
                                        onClick={() => handleAddSlot(day)}
                                        className="text-sm font-bold text-cyan-700 hover:text-cyan-700 flex items-center gap-1"
                                    >
                                        <Plus size={16} /> Add Slot
                                    </button>
                                )}
                            </div>

                            {availability[day]?.enabled && (
                                <div className="pl-16 space-y-3">
                                    {availability[day].slots.map((slot, index) => (
                                        <div key={index} className="flex items-center gap-4 animate-in slide-in-from-left-2 duration-200">
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="time"
                                                        value={slot.start}
                                                        onChange={(e) => handleTimeChange(day, index, 'start', e.target.value)}
                                                        className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm font-medium dark:text-white"
                                                    />
                                                </div>
                                                <span className="text-slate-400 font-medium">to</span>
                                                <div className="relative">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="time"
                                                        value={slot.end}
                                                        onChange={(e) => handleTimeChange(day, index, 'end', e.target.value)}
                                                        className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none text-sm font-medium dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSlot(day, index)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Remove slot"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {availability[day].slots.length === 0 && (
                                        <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg inline-block">
                                            No time slots added. You will appear unavailable on this day.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex justify-end sticky bottom-0 z-10">
                    <button
                        onClick={saveAvailability}
                        disabled={saving}
                        className="px-8 py-3 bg-cyan-700 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-700/20 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>Saving...</>
                        ) : (
                            <>
                                <Save size={20} /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
