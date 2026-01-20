import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DownloadAppSection from '@/components/landing/DownloadAppSection';

interface Session {
    id: string;
    scheduledAt: Timestamp;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    isDemo: boolean;
}

interface Booking {
    id: string;
    studentName: string;
    topic: string;
    sessions: Session[];
    status: 'active' | 'pending' | 'completed' | 'rejected';
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date; // Assuming 1 hour duration for now
    studentName: string;
    bookingId: string;
    isDemo: boolean;
    status: string;
}

export default function TeacherCalendar() {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (user) fetchSchedule();
    }, [user]);

    async function fetchSchedule() {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'bookings'),
                where('teacherId', '==', user.uid),
                where('status', 'in', ['active', 'pending'])
            );
            const snap = await getDocs(q);
            const allBookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

            const calendarEvents: CalendarEvent[] = [];

            allBookings.forEach(booking => {
                booking.sessions?.forEach(session => {
                    if (session.status === 'confirmed') {
                        const startDate = session.scheduledAt.toDate();
                        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

                        calendarEvents.push({
                            id: session.id || `${booking.id}-${startDate.getTime()}`,
                            title: booking.topic,
                            start: startDate,
                            end: endDate,
                            studentName: booking.studentName,
                            bookingId: booking.id,
                            isDemo: session.isDemo,
                            status: session.status
                        });
                    }
                });
            });

            setEvents(calendarEvents);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    }

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate); // 0 = Sunday

        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"></div>);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = events.filter(event =>
                event.start.getDate() === day &&
                event.start.getMonth() === currentDate.getMonth() &&
                event.start.getFullYear() === currentDate.getFullYear()
            );

            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div key={day} className={`h-32 border border-slate-100 dark:border-slate-800 p-2 overflow-y-auto group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isToday ? 'bg-cyan-50/30 dark:bg-cyan-900/10' : 'bg-white dark:bg-slate-900'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-cyan-700 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {day}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="text-[10px] font-bold text-slate-400">{dayEvents.length} sessions</span>
                        )}
                    </div>

                    <div className="space-y-1">
                        {dayEvents.map((event, idx) => (
                            <Link
                                key={idx}
                                to={`/teacher/bookings/${event.bookingId}`}
                                className="block text-xs p-1.5 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-100 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors truncate border-l-2 border-cyan-500"
                                title={`${event.title} with ${event.studentName}`}
                            >
                                <div className="font-bold truncate">{event.title}</div>
                                <div className="text-[10px] opacity-80 truncate">{event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="animate-spin text-cyan-700" size={32} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Calendar</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your monthly schedule.</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-bold min-w-[140px] text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                    {renderCalendarDays()}
                </div>
            </div>

            <div className="mt-12">
                <DownloadAppSection />
            </div>
        </div>
    );
}
