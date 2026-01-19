import React from 'react';
import { Clock, Check } from 'lucide-react';

interface AvailabilityMapProps {
    availability?: any; // Mocking for now
    onSlotClick?: (day: string, slot: string) => void;
}

export default function AvailabilityMap({ availability, onSlotClick }: AvailabilityMapProps) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const periods = [
        { name: 'Morning', slots: ['08:00', '09:00', '10:00', '11:00'] },
        { name: 'Afternoon', slots: ['12:00', '13:00', '14:00', '15:00', '16:00'] },
        { name: 'Evening', slots: ['17:00', '18:00', '19:00', '20:00'] },
        { name: 'Night', slots: ['21:00', '22:00', '23:00'] }
    ];

    // Richer Mock availability data
    const mockAvailability: any = availability || {
        'Mon': ['08:00', '09:00', '10:00', '14:00', '15:00', '19:00', '20:00'],
        'Tue': ['09:00', '11:00', '13:00', '14:00', '18:00', '21:00', '22:00'],
        'Wed': ['08:00', '10:00', '12:00', '13:00', '15:00', '19:00', '20:00', '21:00'],
        'Thu': ['10:00', '11:00', '14:00', '16:00', '18:00', '19:00', '22:00'],
        'Fri': ['08:00', '09:00', '12:00', '13:00', '17:00', '18:00', '20:00', '21:00', '23:00'],
        'Sat': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
        'Sun': ['10:00', '11:00', '18:00', '19:00', '20:00']
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 mt-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-cyan-700 dark:text-cyan-400" />
                Weekly Availability
            </h3>

            <div className="overflow-x-auto pb-2 -mx-2 px-2">
                <div className="min-w-[320px]">
                    {/* Days Header */}
                    <div className="grid grid-cols-8 gap-1 mb-2 sticky top-0 bg-white dark:bg-slate-900 z-10 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="col-span-1"></div>
                        {days.map(day => (
                            <div key={day} className="text-[10px] font-bold text-slate-400 text-center uppercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Scrollable Periods */}
                    <div className="max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                        {periods.map((period) => (
                            <div key={period.name} className="mb-4">
                                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 pl-1 border-l-2 border-cyan-500 sticky left-0">
                                    {period.name}
                                </div>
                                <div className="grid grid-cols-8 gap-1">
                                    {period.slots.map(slot => (
                                        <React.Fragment key={slot}>
                                            <div className="text-[10px] text-slate-400 flex items-center justify-end pr-2 py-1">
                                                {slot}
                                            </div>
                                            {days.map(day => {
                                                const isAvailable = Array.isArray(mockAvailability[day]) && mockAvailability[day].includes(slot);
                                                return (
                                                    <button
                                                        key={`${day}-${slot}`}
                                                        onClick={() => isAvailable && onSlotClick?.(day, slot)}
                                                        disabled={!isAvailable}
                                                        className={`aspect-square rounded-sm border transition-all flex items-center justify-center ${isAvailable
                                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:scale-110 cursor-pointer'
                                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-transparent cursor-not-allowed'
                                                            }`}
                                                        title={isAvailable ? `${day} at ${slot} - Click to Book` : 'Unavailable'}
                                                    >
                                                        {isAvailable && <Check size={8} strokeWidth={3} />}
                                                    </button>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-sm"></div>
                    Available
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-sm"></div>
                    Booked/Off
                </div>
            </div>
        </div>
    );
}
