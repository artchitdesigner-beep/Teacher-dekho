import React from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '@/components/ui/Container';

interface ScheduleCardProps {
    date: string;
    time: string;
    title: string;
    duration: string;
    timeRemaining: string;
    status: 'Pending' | 'Completed' | 'Upcoming';
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    date,
    time,
    title,
    duration,
    timeRemaining,
    status
}) => {
    return (
        <div className="bg-white border border-slate-200 flex flex-col justify-between p-[16px] rounded-[16px] min-w-[260px] max-w-[260px] h-[188px] shrink-0 mx-2 first:ml-0 shadow-sm">
            <div className="flex flex-col gap-[16px]">
                {/* Header (Date / Time) */}
                <div className="flex justify-between items-center w-full">
                    <div className="bg-indigo-50 flex items-center justify-center gap-1.5 px-[10px] py-[4px] rounded-lg">
                        <Calendar className="w-3 h-3 text-[#007ec3]" />
                        <span className="font-bold text-[#007ec3] text-[12px]">{date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[12px] font-medium tracking-tight">{time}</span>
                    </div>
                </div>

                {/* Body (Title / Details) */}
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <h3 className="font-semibold text-slate-900 text-[16px] leading-[24px] truncate w-full">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                        <span>{duration}</span>
                        <span>|</span>
                        <span className="text-red-500 font-medium">{timeRemaining}</span>
                    </div>
                </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
                <button className="bg-amber-50 border border-amber-100 text-amber-700 font-bold text-[12px] flex-1 py-2 rounded-xl transition-colors hover:bg-amber-100">
                    {status}
                </button>
                <button className="bg-slate-50 text-slate-600 font-bold text-[12px] px-4 py-2 rounded-xl transition-colors hover:bg-slate-100 border border-transparent">
                    Details
                </button>
            </div>
        </div>
    );
};

export default function YourSchedule() {
    const defaultClasses: ScheduleCardProps[] = [
        {
            date: "Jan 8",
            time: "10:00 AM",
            title: "Mathematics Foundation - In...",
            duration: "1 hour session",
            timeRemaining: "21:02 to go",
            status: "Pending"
        },
        {
            date: "Jan 8",
            time: "10:00 AM",
            title: "Mathematics Foundation - In...",
            duration: "1 hour session",
            timeRemaining: "21:02 to go",
            status: "Pending"
        },
        {
            date: "Jan 8",
            time: "10:00 AM",
            title: "Mathematics Foundation - In...",
            duration: "1 hour session",
            timeRemaining: "21:02 to go",
            status: "Pending"
        },
        {
            date: "Jan 8",
            time: "10:00 AM",
            title: "Mathematics Foundation - In...",
            duration: "1 hour session",
            timeRemaining: "21:02 to go",
            status: "Pending"
        },
        {
            date: "Jan 8",
            time: "10:00 AM",
            title: "Mathematics Foundation - In...",
            duration: "1 hour session",
            timeRemaining: "21:02 to go",
            status: "Pending"
        }
    ];

    return (
        <section className="w-full bg-transparent py-[80px] relative overflow-hidden">
            <Container className="relative z-10">
                <div className="flex flex-col gap-6">
                    {/* Top Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[20px] md:text-[24px] font-bold text-slate-900 leading-tight">
                                Your Schedule
                            </h2>
                            <div className="bg-indigo-100 text-indigo-700 text-[12px] font-bold px-2 py-0.5 rounded-full">
                                4
                            </div>
                        </div>
                        <button className="bg-white border border-slate-200 hover:bg-slate-50 transition w-auto px-4 py-2 rounded-xl text-slate-700 font-bold text-[14px]">
                            My Courses
                        </button>
                    </div>

                    {/* Cards Carousel */}
                    <div className="relative w-full">
                        {/* Left Arrow */}
                        <button className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur border border-slate-100 shadow-md rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition z-20">
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Cards Container */}
                        <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 gap-2">
                            {defaultClasses.map((item, index) => (
                                <ScheduleCard key={index} {...item} />
                            ))}
                        </div>

                        {/* Right Arrow */}
                        <button className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition z-20">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
