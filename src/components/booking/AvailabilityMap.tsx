import React from 'react';
import { Clock, Check } from 'lucide-react';

interface AvailabilityMapProps {
    availability?: any; // Mocking for now
}

export default function AvailabilityMap({ availability }: AvailabilityMapProps) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];

    // Mock availability data if not provided
    const mockAvailability: any = availability || {
        'Mon': ['09:00', '11:00', '17:00'],
        'Tue': ['13:00', '15:00', '19:00'],
        'Wed': ['09:00', '11:00', '13:00', '15:00'],
        'Thu': ['17:00', '19:00'],
        'Fri': ['09:00', '13:00', '17:00'],
        'Sat': ['11:00', '15:00'],
        'Sun': []
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Weekly Availability
            </h3>

            <div className="overflow-x-auto pb-2 -mx-2 px-2">
                <div className="grid grid-cols-8 gap-1 min-w-[280px]">
                    <div className="col-span-1"></div>
                    {days.map(day => (
                        <div key={day} className="text-[10px] font-bold text-slate-400 text-center uppercase">
                            {day}
                        </div>
                    ))}

                    {timeSlots.map(slot => (
                        <React.Fragment key={slot}>
                            <div className="text-[10px] text-slate-400 flex items-center justify-end pr-2">
                                {slot}
                            </div>
                            {days.map(day => {
                                const isAvailable = mockAvailability[day]?.includes(slot);
                                return (
                                    <div
                                        key={`${day}-${slot}`}
                                        className={`aspect-square rounded-sm border transition-colors flex items-center justify-center ${isAvailable
                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                            : 'bg-slate-50 border-slate-100 text-transparent'
                                            }`}
                                        title={isAvailable ? `${day} at ${slot}` : 'Unavailable'}
                                    >
                                        {isAvailable && <Check size={8} strokeWidth={3} />}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-medium text-slate-500">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-50 border border-emerald-100 rounded-sm"></div>
                    Available
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-50 border border-slate-100 rounded-sm"></div>
                    Booked/Off
                </div>
            </div>
        </div>
    );
}
